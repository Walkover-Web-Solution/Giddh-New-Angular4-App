import { Injectable } from '@angular/core';
import { DscCertificate } from './dsc.service';

/** Supported "remember PIN" durations. `permanent` never expires. */
export type DscPinDuration = '15m' | '2h' | '1d' | '7d' | '30d';

/** Single encrypted PIN entry persisted in localStorage, keyed by certificate serial. */
interface StoredPinEntry {
    /** Certificate id the PIN belongs to (extra device-binding check). */
    certId: string;
    /** Certificate serial number (primary device-binding key). */
    serial: string;
    /** Base64 AES-GCM ciphertext of the PIN. */
    ciphertext: string;
    /** Base64 initialisation vector used for encryption. */
    iv: string;
    /** Base64 PBKDF2 salt used to derive the encryption key. */
    salt: string;
    /** Expiry timestamp in epoch ms, or null for permanent. */
    expiresAt: number | null;
    /** Retention duration key that was selected when the PIN was saved. */
    duration?: DscPinDuration;
    /** Owner name kept only for reference/debugging. */
    subjectCn?: string;
}

/**
 * Stores the DSC token PIN on the client (localStorage) in a basic encrypted
 * form so it cannot be trivially read. The PIN is only ever reused when the
 * same physical token is connected (matched by certificate serial + certId),
 * and only until the user-chosen expiry.
 *
 * Encryption uses the browser Web Crypto API (AES-GCM) with a key derived
 * (PBKDF2) from a per-browser random device secret combined with the
 * certificate serial, so the ciphertext is bound to this browser and token.
 */
@Injectable({
    providedIn: 'root'
})
export class DscPinStorageService {
    /** localStorage key holding the map of serial -> encrypted entry. */
    private static readonly STORE_KEY = 'giddh_dsc_pins';
    /** localStorage key holding the per-browser random device secret. */
    private static readonly DEVICE_KEY = 'giddh_dsc_device';

    /** Duration option -> lifetime in milliseconds (null = permanent). */
    private static readonly DURATION_MS: Record<DscPinDuration, number | null> = {
        '15m': 15 * 60 * 1000,
        '2h': 2 * 60 * 60 * 1000,
        '1d': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000
    };

    /**
     * Encrypts and stores the PIN for a certificate with the chosen expiry.
     *
     * @param {DscCertificate} certificate Certificate the PIN unlocks
     * @param {string} pin Token PIN to remember
     * @param {DscPinDuration} duration Chosen retention duration
     * @returns {Promise<void>}
     * @memberof DscPinStorageService
     */
    public async savePin(certificate: DscCertificate, pin: string, duration: DscPinDuration): Promise<void> {
        console.info('[DSC Storage] savePin called for certificate:', {
            subjectCn: certificate?.subjectCn,
            serial: certificate?.serial,
            certId: certificate?.certId,
            duration
        });
        const serial = certificate?.serial;
        if (!serial || !pin) {
            return;
        }
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const key = await this.deriveKey(serial, salt);
        const encrypted = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            key,
            new TextEncoder().encode(pin)
        );
        const lifetime = DscPinStorageService.DURATION_MS[duration];
        const entry: StoredPinEntry = {
            certId: certificate.certId,
            serial,
            ciphertext: this.toBase64(new Uint8Array(encrypted)),
            iv: this.toBase64(iv),
            salt: this.toBase64(salt),
            expiresAt: lifetime === null ? null : Date.now() + lifetime,
            duration,
            subjectCn: certificate.subjectCn
        };
        const store = this.readStore();
        store[serial] = entry;
        this.writeStore(store);
    }

    /**
     * Returns the remembered PIN and its chosen duration for a certificate only when
     * the same token is connected (serial + certId match) and the entry has not expired.
     * Expired or mismatched entries are pruned.
     *
     * @param {DscCertificate} certificate Currently connected certificate
     * @returns {Promise<{ pin: string; duration: DscPinDuration } | null>}
     * @memberof DscPinStorageService
     */
    public async getPin(certificate: DscCertificate): Promise<{ pin: string; duration: DscPinDuration } | null> {
        console.info('[DSC Storage] getPin called for certificate:', certificate?.certId);
        const pin = await this.decryptPin(certificate);
        if (pin === null) {
            return null;
        }
        const serial = certificate.serial;
        const entry = this.readStore()[serial];
        const duration = entry?.duration ?? '15m';
        console.info('[DSC Storage] Remembered PIN found with duration:', duration);
        return { pin, duration };
    }

    /**
     * Decrypts the stored PIN for a certificate when the same token is connected.
     *
     * @private
     * @param {DscCertificate} certificate Currently connected certificate
     * @returns {Promise<string | null>}
     * @memberof DscPinStorageService
     */
    private async decryptPin(certificate: DscCertificate): Promise<string | null> {
        const serial = certificate?.serial;
        if (!serial) {
            return null;
        }
        const store = this.readStore();
        const entry = store[serial];
        if (!entry) {
            return null;
        }
        // Device binding: only reuse when the exact same certificate is present.
        if (entry.certId !== certificate.certId || entry.serial !== serial) {
            this.forgetPin(certificate);
            return null;
        }
        if (entry.expiresAt !== null && Date.now() > entry.expiresAt) {
            this.forgetPin(certificate);
            return null;
        }
        try {
            const key = await this.deriveKey(serial, this.fromBase64(entry.salt));
            const decrypted = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv: this.fromBase64(entry.iv) as BufferSource },
                key,
                this.fromBase64(entry.ciphertext) as BufferSource
            );
            console.info('[DSC Storage] Remembered PIN decrypted successfully for certificate:', certificate.certId);
            return new TextDecoder().decode(decrypted);
        } catch {
            // Corrupt/undecryptable entry (e.g. device secret changed) - drop it.
            this.forgetPin(certificate);
            return null;
        }
    }

    /**
     * Returns true when a non-expired remembered entry exists for the certificate.
     *
     * @param {DscCertificate} certificate Certificate to check
     * @returns {boolean}
     * @memberof DscPinStorageService
     */
    public hasPin(certificate: DscCertificate): boolean {
        const serial = certificate?.serial;
        if (!serial) {
            return false;
        }
        const entry = this.readStore()[serial];
        if (!entry) {
            return false;
        }
        if (entry.expiresAt !== null && Date.now() > entry.expiresAt) {
            this.forgetPin(certificate);
            return false;
        }
        return entry.certId === certificate.certId;
    }

    /**
     * Removes the remembered PIN entry for a certificate.
     *
     * @param {DscCertificate} certificate Certificate whose entry to remove
     * @memberof DscPinStorageService
     */
    public forgetPin(certificate: DscCertificate): void {
        console.info('[DSC Storage] forgetPin called for certificate:', certificate?.certId);
        const serial = certificate?.serial;
        if (!serial) {
            return;
        }
        const store = this.readStore();
        if (store[serial]) {
            delete store[serial];
            this.writeStore(store);
        }
    }

    /**
     * Derives an AES-GCM key from the per-browser device secret + certificate serial.
     *
     * @private
     * @param {string} serial Certificate serial number
     * @param {Uint8Array} salt PBKDF2 salt
     * @returns {Promise<CryptoKey>}
     * @memberof DscPinStorageService
     */
    private async deriveKey(serial: string, salt: Uint8Array): Promise<CryptoKey> {
        const material = await crypto.subtle.importKey(
            'raw',
            new TextEncoder().encode(`${this.getDeviceSecret()}:${serial}`),
            'PBKDF2',
            false,
            ['deriveKey']
        );
        return crypto.subtle.deriveKey(
            { name: 'PBKDF2', salt: salt as BufferSource, iterations: 100000, hash: 'SHA-256' },
            material,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt', 'decrypt']
        );
    }

    /**
     * Returns the per-browser random device secret, creating and persisting it once.
     *
     * @private
     * @returns {string}
     * @memberof DscPinStorageService
     */
    private getDeviceSecret(): string {
        let secret = localStorage.getItem(DscPinStorageService.DEVICE_KEY);
        if (!secret) {
            secret = this.toBase64(crypto.getRandomValues(new Uint8Array(32)));
            localStorage.setItem(DscPinStorageService.DEVICE_KEY, secret);
        }
        return secret;
    }

    /**
     * Reads the stored entry map from localStorage.
     *
     * @private
     * @returns {Record<string, StoredPinEntry>}
     * @memberof DscPinStorageService
     */
    private readStore(): Record<string, StoredPinEntry> {
        try {
            const raw = localStorage.getItem(DscPinStorageService.STORE_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch {
            return {};
        }
    }

    /**
     * Writes the stored entry map to localStorage.
     *
     * @private
     * @param {Record<string, StoredPinEntry>} store Entry map to persist
     * @memberof DscPinStorageService
     */
    private writeStore(store: Record<string, StoredPinEntry>): void {
        localStorage.setItem(DscPinStorageService.STORE_KEY, JSON.stringify(store));
    }

    /**
     * Encodes bytes to a base64 string.
     *
     * @private
     * @param {Uint8Array} bytes Bytes to encode
     * @returns {string}
     * @memberof DscPinStorageService
     */
    private toBase64(bytes: Uint8Array): string {
        let binary = '';
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    /**
     * Decodes a base64 string to bytes.
     *
     * @private
     * @param {string} value Base64 string
     * @returns {Uint8Array}
     * @memberof DscPinStorageService
     */
    private fromBase64(value: string): Uint8Array {
        const binary = atob(value);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes;
    }
}
