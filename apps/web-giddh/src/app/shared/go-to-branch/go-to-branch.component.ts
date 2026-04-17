import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * A reusable component that displays an informational message with a "Go to Branch" action button.
 * Broadcasts a message on a configurable BroadcastChannel to trigger branch tab navigation.
 *
 * Use variant="inline" (default) for placement next to other controls in a header bar.
 * Use variant="banner" for a full-width amber info card with icon, title and optional subtitle.
 */
@Component({
    selector: 'go-to-branch',
    templateUrl: './go-to-branch.component.html',
    styleUrls: ['./go-to-branch.component.scss'],
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoToBranchComponent {
    /** Bold title text displayed in the banner variant */
    readonly title = input<string>('');

    /** Informational message displayed before the button (subtitle in banner, full text in inline) */
    readonly message = input<string>('');

    /** Display variant: 'inline' (default) for header bars, 'banner' for full-width amber card */
    readonly variant = input<'inline' | 'banner'>('banner');

    /** CSS classes for the container */
    readonly cssClass = input<string>('');

    /** CSS classes for the message span */
    readonly messageCss = input<string>('');

    /** Label text for the action button */
    readonly buttonLabel = input<string>('');

    /** BroadcastChannel name to post the branch navigation message on */
    readonly channelName = input<string>('go-to-branch');

    /**
     * Posts a success message on the configured BroadcastChannel to trigger branch tab navigation.
     */
    protected goToBranch(): void {
        const broadcast = new BroadcastChannel(this.channelName());
        broadcast.postMessage({ success: true });
        broadcast.close();
    }
}
