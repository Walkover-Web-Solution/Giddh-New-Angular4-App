    /** Interface for country data - simplified for use with Google libphonenumber */
export interface Country {
    /** Country name in English */
    name: string;
    /** ISO 3166-1 alpha-2 country code */
    code: string;
    /** International dialing code */
    dialCode: string;
    /** Unicode flag emoji */
    flag: string;
    /** Path to flag image */
    flagImage?: string;
    /** Country name in native language */
    nativeName: string;
}
    /** Comprehensive list of all countries with their telephone data */
export const COUNTRIES_DATA: Country[] = [
    {
        name: 'United States',
        code: 'US',
        dialCode: '+1',
        flag: '🇺🇸',
        flagImage: 'assets/images/flags/us.png',
        nativeName: 'United States'
    },
    {
        name: 'United Kingdom',
        code: 'GB',
        dialCode: '+44',
        flag: '🇬🇧',
        flagImage: 'assets/images/flags/gb.png',
        nativeName: 'United Kingdom'
    },
    // A
    {
        name: 'Åland Islands',
        code: 'AX',
        dialCode: '+358',
        flag: '🇦🇽',
        flagImage: 'assets/images/flags/ax.png',
        nativeName: 'Åland'
    },
    {
        name: 'Afghanistan',
        code: 'AF',
        dialCode: '+93',
        flag: '🇦🇫',
        flagImage: 'assets/images/flags/af.png',
        nativeName: 'افغانستان'
    },
    {
        name: 'Albania',
        code: 'AL',
        dialCode: '+355',
        flag: '🇦🇱',
        flagImage: 'assets/images/flags/al.png',
        nativeName: 'Shqipëria'
    },
    {
        name: 'Algeria',
        code: 'DZ',
        dialCode: '+213',
        flag: '🇩🇿',
        flagImage: 'assets/images/flags/dz.png',
        nativeName: 'الجزائر'
    },
    {
        name: 'American Samoa',
        code: 'AS',
        dialCode: '+1684',
        flag: '🇦🇸',
        flagImage: 'assets/images/flags/as.png',
        nativeName: 'Amerika Sāmoa'
    },
    {
        name: 'Andorra',
        code: 'AD',
        dialCode: '+376',
        flag: '🇦🇩',
        flagImage: 'assets/images/flags/ad.png',
        nativeName: 'Andorra'
    },
    {
        name: 'Angola',
        code: 'AO',
        dialCode: '+244',
        flag: '🇦🇴',
        flagImage: 'assets/images/flags/ao.png',
        nativeName: 'Angola'
    },
    {
        name: 'Anguilla',
        code: 'AI',
        dialCode: '+1264',
        flag: '🇦🇮',
        flagImage: 'assets/images/flags/ai.png',
        nativeName: 'Anguilla'
    },
    {
        name: 'Antigua and Barbuda',
        code: 'AG',
        dialCode: '+1268',
        flag: '🇦🇬',
        flagImage: 'assets/images/flags/ag.png',
        nativeName: 'Antigua and Barbuda'
    },
    {
        name: 'Argentina',
        code: 'AR',
        dialCode: '+54',
        flag: '🇦🇷',
        flagImage: 'assets/images/flags/ar.png',
        nativeName: 'Argentina'
    },
    {
        name: 'Armenia',
        code: 'AM',
        dialCode: '+374',
        flag: '🇦🇲',
        flagImage: 'assets/images/flags/am.png',
        nativeName: 'Հայաստան'
    },
    {
        name: 'Aruba',
        code: 'AW',
        dialCode: '+297',
        flag: '🇦🇼',
        flagImage: 'assets/images/flags/aw.png',
        nativeName: 'Aruba'
    },
    {
        name: 'Australia',
        code: 'AU',
        dialCode: '+61',
        flag: '🇦🇺',
        flagImage: 'assets/images/flags/au.png',
        nativeName: 'Australia'
    },
    {
        name: 'Austria',
        code: 'AT',
        dialCode: '+43',
        flag: '🇦🇹',
        flagImage: 'assets/images/flags/at.png',
        nativeName: 'Österreich'
    },
    {
        name: 'Azerbaijan',
        code: 'AZ',
        dialCode: '+994',
        flag: '🇦🇿',
        flagImage: 'assets/images/flags/az.png',
        nativeName: 'Azərbaycan'
    },
    // B
    {
        name: 'Bahamas',
        code: 'BS',
        dialCode: '+1242',
        flag: '🇧🇸',
        flagImage: 'assets/images/flags/bs.png',
        nativeName: 'The Bahamas'
    },
    {
        name: 'Bahrain',
        code: 'BH',
        dialCode: '+973',
        flag: '🇧🇭',
        flagImage: 'assets/images/flags/bh.png',
        nativeName: 'البحرين'
    },
    {
        name: 'Bangladesh',
        code: 'BD',
        dialCode: '+880',
        flag: '🇧🇩',
        flagImage: 'assets/images/flags/bd.png',
        nativeName: 'বাংলাদেশ'
    },
    {
        name: 'Barbados',
        code: 'BB',
        dialCode: '+1246',
        flag: '🇧🇧',
        flagImage: 'assets/images/flags/bb.png',
        nativeName: 'Barbados'
    },
    {
        name: 'Belarus',
        code: 'BY',
        dialCode: '+375',
        flag: '🇧🇾',
        flagImage: 'assets/images/flags/by.png',
        nativeName: 'Беларусь'
    },
    {
        name: 'Belgium',
        code: 'BE',
        dialCode: '+32',
        flag: '🇧🇪',
        flagImage: 'assets/images/flags/be.png',
        nativeName: 'België / Belgique'
    },
    {
        name: 'Belize',
        code: 'BZ',
        dialCode: '+501',
        flag: '🇧🇿',
        flagImage: 'assets/images/flags/bz.png',
        nativeName: 'Belize'
    },
    {
        name: 'Benin',
        code: 'BJ',
        dialCode: '+229',
        flag: '🇧🇯',
        flagImage: 'assets/images/flags/bj.png',
        nativeName: 'Bénin'
    },
    {
        name: 'Bermuda',
        code: 'BM',
        dialCode: '+1441',
        flag: '🇧🇲',
        flagImage: 'assets/images/flags/bm.png',
        nativeName: 'Bermuda'
    },
    {
        name: 'Bhutan',
        code: 'BT',
        dialCode: '+975',
        flag: '🇧🇹',
        flagImage: 'assets/images/flags/bt.png',
        nativeName: 'འབྲུག'
    },
    {
        name: 'Bolivia',
        code: 'BO',
        dialCode: '+591',
        flag: '🇧🇴',
        flagImage: 'assets/images/flags/bo.png',
        nativeName: 'Bolivia'
    },
    {
        name: 'Bosnia and Herzegovina',
        code: 'BA',
        dialCode: '+387',
        flag: '🇧🇦',
        flagImage: 'assets/images/flags/ba.png',
        nativeName: 'Bosna i Hercegovina'
    },
    {
        name: 'Botswana',
        code: 'BW',
        dialCode: '+267',
        flag: '🇧🇼',
        flagImage: 'assets/images/flags/bw.png',
        nativeName: 'Botswana'
    },
    {
        name: 'Brazil',
        code: 'BR',
        dialCode: '+55',
        flag: '🇧🇷',
        flagImage: 'assets/images/flags/br.png',
        nativeName: 'Brasil'
    },
    {
        name: 'British Indian Ocean Territory',
        code: 'IO',
        dialCode: '+246',
        flag: '🇮🇴',
        flagImage: 'assets/images/flags/io.png',
        nativeName: 'British Indian Ocean Territory'
    },
    {
        name: 'British Virgin Islands',
        code: 'VG',
        dialCode: '+1284',
        flag: '🇻🇬',
        flagImage: 'assets/images/flags/vg.png',
        nativeName: 'British Virgin Islands'
    },
    {
        name: 'Brunei',
        code: 'BN',
        dialCode: '+673',
        flag: '🇧🇳',
        flagImage: 'assets/images/flags/bn.png',
        nativeName: 'Brunei Darussalam'
    },
    {
        name: 'Bulgaria',
        code: 'BG',
        dialCode: '+359',
        flag: '🇧🇬',
        flagImage: 'assets/images/flags/bg.png',
        nativeName: 'България'
    },
    {
        name: 'Burkina Faso',
        code: 'BF',
        dialCode: '+226',
        flag: '🇧🇫',
        flagImage: 'assets/images/flags/bf.png',
        nativeName: 'Burkina Faso'
    },
    {
        name: 'Burundi',
        code: 'BI',
        dialCode: '+257',
        flag: '🇧🇮',
        flagImage: 'assets/images/flags/bi.png',
        nativeName: 'Burundi'
    },
    // C
    {
        name: 'Cambodia',
        code: 'KH',
        dialCode: '+855',
        flag: '🇰🇭',
        flagImage: 'assets/images/flags/kh.png',
        nativeName: 'កម្ពុជា'
    },
    {
        name: 'Cameroon',
        code: 'CM',
        dialCode: '+237',
        flag: '🇨🇲',
        flagImage: 'assets/images/flags/cm.png',
        nativeName: 'Cameroun'
    },
    {
        name: 'Canada',
        code: 'CA',
        dialCode: '+1',
        flag: '🇨🇦',
        flagImage: 'assets/images/flags/ca.png',
        nativeName: 'Canada'
    },
    {
        name: 'Cape Verde',
        code: 'CV',
        dialCode: '+238',
        flag: '🇨🇻',
        flagImage: 'assets/images/flags/cv.png',
        nativeName: 'Cabo Verde'
    },
    {
        name: 'Caribbean Netherlands',
        code: 'BQ',
        dialCode: '+599',
        flag: '🇧🇶',
        flagImage: 'assets/images/flags/bq.png',
        nativeName: 'Caribbean Netherlands'
    },
    {
        name: 'Cayman Islands',
        code: 'KY',
        dialCode: '+1345',
        flag: '🇰🇾',
        flagImage: 'assets/images/flags/ky.png',
        nativeName: 'Cayman Islands'
    },
    {
        name: 'Central African Republic',
        code: 'CF',
        dialCode: '+236',
        flag: '🇨🇫',
        flagImage: 'assets/images/flags/cf.png',
        nativeName: 'République Centrafricaine'
    },
    {
        name: 'Chad',
        code: 'TD',
        dialCode: '+235',
        flag: '🇹🇩',
        flagImage: 'assets/images/flags/td.png',
        nativeName: 'تشاد'
    },
    {
        name: 'Chile',
        code: 'CL',
        dialCode: '+56',
        flag: '🇨🇱',
        flagImage: 'assets/images/flags/cl.png',
        nativeName: 'Chile'
    },
    {
        name: 'China',
        code: 'CN',
        dialCode: '+86',
        flag: '🇨🇳',
        flagImage: 'assets/images/flags/cn.png',
        nativeName: '中国'
    },
    {
        name: 'Christmas Island',
        code: 'CX',
        dialCode: '+61',
        flag: '🇨🇽',
        flagImage: 'assets/images/flags/cx.png',
        nativeName: 'Christmas Island'
    },
    {
        name: 'Cocos (Keeling) Islands',
        code: 'CC',
        dialCode: '+61',
        flag: '🇨🇨',
        flagImage: 'assets/images/flags/cc.png',
        nativeName: 'Cocos (Keeling) Islands'
    },
    {
        name: 'Colombia',
        code: 'CO',
        dialCode: '+57',
        flag: '🇨🇴',
        flagImage: 'assets/images/flags/co.png',
        nativeName: 'Colombia'
    },
    {
        name: 'Comoros',
        code: 'KM',
        dialCode: '+269',
        flag: '🇰🇲',
        flagImage: 'assets/images/flags/km.png',
        nativeName: 'Komori'
    },
    {
        name: 'Congo',
        code: 'CG',
        dialCode: '+242',
        flag: '🇨🇬',
        flagImage: 'assets/images/flags/cg.png',
        nativeName: 'Congo'
    },
    {
        name: 'Democratic Republic of the Congo',
        code: 'CD',
        dialCode: '+243',
        flag: '🇨🇩',
        flagImage: 'assets/images/flags/cd.png',
        nativeName: 'République Démocratique du Congo'
    },
    {
        name: 'Cook Islands',
        code: 'CK',
        dialCode: '+682',
        flag: '🇨🇰',
        flagImage: 'assets/images/flags/ck.png',
        nativeName: 'Cook Islands'
    },
    {
        name: 'Costa Rica',
        code: 'CR',
        dialCode: '+506',
        flag: '🇨🇷',
        flagImage: 'assets/images/flags/cr.png',
        nativeName: 'Costa Rica'
    },
    {
        name: 'Croatia',
        code: 'HR',
        dialCode: '+385',
        flag: '🇭🇷',
        flagImage: 'assets/images/flags/hr.png',
        nativeName: 'Hrvatska'
    },
    {
        name: 'Cuba',
        code: 'CU',
        dialCode: '+53',
        flag: '🇨🇺',
        flagImage: 'assets/images/flags/cu.png',
        nativeName: 'Cuba'
    },
    {
        name: 'Curaçao',
        code: 'CW',
        dialCode: '+599',
        flag: '🇨🇼',
        flagImage: 'assets/images/flags/cw.png',
        nativeName: 'Curaçao'
    },
    {
        name: 'Cyprus',
        code: 'CY',
        dialCode: '+357',
        flag: '🇨🇾',
        flagImage: 'assets/images/flags/cy.png',
        nativeName: 'Κύπρος'
    },
    {
        name: 'Czech Republic',
        code: 'CZ',
        dialCode: '+420',
        flag: '🇨🇿',
        flagImage: 'assets/images/flags/cz.png',
        nativeName: 'Česká republika'
    },
    // D
    {
        name: 'Denmark',
        code: 'DK',
        dialCode: '+45',
        flag: '🇩🇰',
        flagImage: 'assets/images/flags/dk.png',
        nativeName: 'Danmark'
    },
    {
        name: 'Djibouti',
        code: 'DJ',
        dialCode: '+253',
        flag: '🇩🇯',
        flagImage: 'assets/images/flags/dj.png',
        nativeName: 'Djibouti'
    },
    {
        name: 'Dominica',
        code: 'DM',
        dialCode: '+1767',
        flag: '🇩🇲',
        flagImage: 'assets/images/flags/dm.png',
        nativeName: 'Dominica'
    },
    {
        name: 'Dominican Republic',
        code: 'DO',
        dialCode: '+1809',
        flag: '🇩🇴',
        flagImage: 'assets/images/flags/do.png',
        nativeName: 'República Dominicana'
    },
    // E
    {
        name: 'Ecuador',
        code: 'EC',
        dialCode: '+593',
        flag: '🇪🇨',
        flagImage: 'assets/images/flags/ec.png',
        nativeName: 'Ecuador'
    },
    {
        name: 'Egypt',
        code: 'EG',
        dialCode: '+20',
        flag: '🇪🇬',
        flagImage: 'assets/images/flags/eg.png',
        nativeName: 'مصر'
    },
    {
        name: 'El Salvador',
        code: 'SV',
        dialCode: '+503',
        flag: '🇸🇻',
        flagImage: 'assets/images/flags/sv.png',
        nativeName: 'El Salvador'
    },
    {
        name: 'Equatorial Guinea',
        code: 'GQ',
        dialCode: '+240',
        flag: '🇬🇶',
        flagImage: 'assets/images/flags/gq.png',
        nativeName: 'Guinea Ecuatorial'
    },
    {
        name: 'Eritrea',
        code: 'ER',
        dialCode: '+291',
        flag: '🇪🇷',
        flagImage: 'assets/images/flags/er.png',
        nativeName: 'ኤርትራ'
    },
    {
        name: 'Estonia',
        code: 'EE',
        dialCode: '+372',
        flag: '🇪🇪',
        flagImage: 'assets/images/flags/ee.png',
        nativeName: 'Eesti'
    },
    {
        name: 'Eswatini',
        code: 'SZ',
        dialCode: '+268',
        flag: '🇸🇿',
        flagImage: 'assets/images/flags/sz.png',
        nativeName: 'Eswatini'
    },
    {
        name: 'Ethiopia',
        code: 'ET',
        dialCode: '+251',
        flag: '🇪🇹',
        flagImage: 'assets/images/flags/et.png',
        nativeName: 'ኢትዮጵያ'
    },
    // F
    {
        name: 'Falkland Islands',
        code: 'FK',
        dialCode: '+500',
        flag: '🇫🇰',
        flagImage: 'assets/images/flags/fk.png',
        nativeName: 'Falkland Islands'
    },
    {
        name: 'Faroe Islands',
        code: 'FO',
        dialCode: '+298',
        flag: '🇫🇴',
        flagImage: 'assets/images/flags/fo.png',
        nativeName: 'Føroyar'
    },
    {
        name: 'Fiji',
        code: 'FJ',
        dialCode: '+679',
        flag: '🇫🇯',
        flagImage: 'assets/images/flags/fj.png',
        nativeName: 'Fiji'
    },
    {
        name: 'Finland',
        code: 'FI',
        dialCode: '+358',
        flag: '🇫🇮',
        flagImage: 'assets/images/flags/fi.png',
        nativeName: 'Suomi'
    },
    {
        name: 'France',
        code: 'FR',
        dialCode: '+33',
        flag: '🇫🇷',
        flagImage: 'assets/images/flags/fr.png',
        nativeName: 'France'
    },
    {
        name: 'French Guiana',
        code: 'GF',
        dialCode: '+594',
        flag: '🇬🇫',
        flagImage: 'assets/images/flags/gf.png',
        nativeName: 'Guyane française'
    },
    {
        name: 'French Polynesia',
        code: 'PF',
        dialCode: '+689',
        flag: '🇵🇫',
        flagImage: 'assets/images/flags/pf.png',
        nativeName: 'Polynésie française'
    },
    // G
    {
        name: 'Gabon',
        code: 'GA',
        dialCode: '+241',
        flag: '🇬🇦',
        flagImage: 'assets/images/flags/ga.png',
        nativeName: 'Gabon'
    },
    {
        name: 'Gambia',
        code: 'GM',
        dialCode: '+220',
        flag: '🇬🇲',
        flagImage: 'assets/images/flags/gm.png',
        nativeName: 'Gambia'
    },
    {
        name: 'Georgia',
        code: 'GE',
        dialCode: '+995',
        flag: '🇬🇪',
        flagImage: 'assets/images/flags/ge.png',
        nativeName: 'საქართველო'
    },
    {
        name: 'Germany',
        code: 'DE',
        dialCode: '+49',
        flag: '🇩🇪',
        flagImage: 'assets/images/flags/de.png',
        nativeName: 'Deutschland'
    },
    {
        name: 'Ghana',
        code: 'GH',
        dialCode: '+233',
        flag: '🇬🇭',
        flagImage: 'assets/images/flags/gh.png',
        nativeName: 'Ghana'
    },
    {
        name: 'Gibraltar',
        code: 'GI',
        dialCode: '+350',
        flag: '🇬🇮',
        flagImage: 'assets/images/flags/gi.png',
        nativeName: 'Gibraltar'
    },
    {
        name: 'Greece',
        code: 'GR',
        dialCode: '+30',
        flag: '🇬🇷',
        flagImage: 'assets/images/flags/gr.png',
        nativeName: 'Ελλάδα'
    },
    {
        name: 'Greenland',
        code: 'GL',
        dialCode: '+299',
        flag: '🇬🇱',
        flagImage: 'assets/images/flags/gl.png',
        nativeName: 'Kalaallit Nunaat'
    },
    {
        name: 'Grenada',
        code: 'GD',
        dialCode: '+1473',
        flag: '🇬🇩',
        flagImage: 'assets/images/flags/gd.png',
        nativeName: 'Grenada'
    },
    {
        name: 'Guadeloupe',
        code: 'GP',
        dialCode: '+590',
        flag: '🇬🇵',
        flagImage: 'assets/images/flags/gp.png',
        nativeName: 'Guadeloupe'
    },
    {
        name: 'Guam',
        code: 'GU',
        dialCode: '+1671',
        flag: '🇬🇺',
        flagImage: 'assets/images/flags/gu.png',
        nativeName: 'Guåhan'
    },
    {
        name: 'Guatemala',
        code: 'GT',
        dialCode: '+502',
        flag: '🇬🇹',
        flagImage: 'assets/images/flags/gt.png',
        nativeName: 'Guatemala'
    },
    {
        name: 'Guernsey',
        code: 'GG',
        dialCode: '+44',
        flag: '🇬🇬',
        flagImage: 'assets/images/flags/gg.png',
        nativeName: 'Guernsey'
    },
    {
        name: 'Guinea',
        code: 'GN',
        dialCode: '+224',
        flag: '🇬🇳',
        flagImage: 'assets/images/flags/gn.png',
        nativeName: 'Guinée'
    },
    {
        name: 'Guinea-Bissau',
        code: 'GW',
        dialCode: '+245',
        flag: '🇬🇼',
        flagImage: 'assets/images/flags/gw.png',
        nativeName: 'Guiné-Bissau'
    },
    {
        name: 'Guyana',
        code: 'GY',
        dialCode: '+592',
        flag: '🇬🇾',
        flagImage: 'assets/images/flags/gy.png',
        nativeName: 'Guyana'
    },
    // H
    {
        name: 'Haiti',
        code: 'HT',
        dialCode: '+509',
        flag: '🇭🇹',
        flagImage: 'assets/images/flags/ht.png',
        nativeName: 'Haïti'
    },
    {
        name: 'Honduras',
        code: 'HN',
        dialCode: '+504',
        flag: '🇭🇳',
        flagImage: 'assets/images/flags/hn.png',
        nativeName: 'Honduras'
    },
    {
        name: 'Hong Kong',
        code: 'HK',
        dialCode: '+852',
        flag: '🇭🇰',
        flagImage: 'assets/images/flags/hk.png',
        nativeName: '香港'
    },
    {
        name: 'Hungary',
        code: 'HU',
        dialCode: '+36',
        flag: '🇭🇺',
        flagImage: 'assets/images/flags/hu.png',
        nativeName: 'Magyarország'
    },
    // I
    {
        name: 'Iceland',
        code: 'IS',
        dialCode: '+354',
        flag: '🇮🇸',
        flagImage: 'assets/images/flags/is.png',
        nativeName: 'Ísland'
    },
    {
        name: 'India',
        code: 'IN',
        dialCode: '+91',
        flag: '🇮🇳',
        flagImage: 'assets/images/flags/in.png',
        nativeName: 'भारत'
    },
    {
        name: 'Indonesia',
        code: 'ID',
        dialCode: '+62',
        flag: '🇮🇩',
        flagImage: 'assets/images/flags/id.png',
        nativeName: 'Indonesia'
    },
    {
        name: 'Iran',
        code: 'IR',
        dialCode: '+98',
        flag: '🇮🇷',
        flagImage: 'assets/images/flags/ir.png',
        nativeName: 'ایران'
    },
    {
        name: 'Iraq',
        code: 'IQ',
        dialCode: '+964',
        flag: '🇮🇶',
        flagImage: 'assets/images/flags/iq.png',
        nativeName: 'العراق'
    },
    {
        name: 'Ireland',
        code: 'IE',
        dialCode: '+353',
        flag: '🇮🇪',
        flagImage: 'assets/images/flags/ie.png',
        nativeName: 'Éire'
    },
    {
        name: 'Isle of Man',
        code: 'IM',
        dialCode: '+44',
        flag: '🇮🇲',
        flagImage: 'assets/images/flags/im.png',
        nativeName: 'Isle of Man'
    },
    {
        name: 'Israel',
        code: 'IL',
        dialCode: '+972',
        flag: '🇮🇱',
        flagImage: 'assets/images/flags/il.png',
        nativeName: 'ישראל'
    },
    {
        name: 'Italy',
        code: 'IT',
        dialCode: '+39',
        flag: '🇮🇹',
        flagImage: 'assets/images/flags/it.png',
        nativeName: 'Italia'
    },
    {
        name: 'Ivory Coast',
        code: 'CI',
        dialCode: '+225',
        flag: '🇨🇮',
        flagImage: 'assets/images/flags/ci.png',
        nativeName: 'Côte d\'Ivoire'
    },
    // J
    {
        name: 'Jamaica',
        code: 'JM',
        dialCode: '+1876',
        flag: '🇯🇲',
        flagImage: 'assets/images/flags/jm.png',
        nativeName: 'Jamaica'
    },
    {
        name: 'Japan',
        code: 'JP',
        dialCode: '+81',
        flag: '🇯🇵',
        flagImage: 'assets/images/flags/jp.png',
        nativeName: '日本'
    },
    {
        name: 'Jersey',
        code: 'JE',
        dialCode: '+44',
        flag: '🇯🇪',
        flagImage: 'assets/images/flags/je.png',
        nativeName: 'Jersey'
    },
    {
        name: 'Jordan',
        code: 'JO',
        dialCode: '+962',
        flag: '🇯🇴',
        flagImage: 'assets/images/flags/jo.png',
        nativeName: 'الأردن'
    },
    // K
    {
        name: 'Kazakhstan',
        code: 'KZ',
        dialCode: '+7',
        flag: '🇰🇿',
        flagImage: 'assets/images/flags/kz.png',
        nativeName: 'Қазақстан'
    },
    {
        name: 'Kenya',
        code: 'KE',
        dialCode: '+254',
        flag: '🇰🇪',
        flagImage: 'assets/images/flags/ke.png',
        nativeName: 'Kenya'
    },
    {
        name: 'Kiribati',
        code: 'KI',
        dialCode: '+686',
        flag: '🇰🇮',
        flagImage: 'assets/images/flags/ki.png',
        nativeName: 'Kiribati'
    },
    {
        name: 'Kosovo',
        code: 'XK',
        dialCode: '+383',
        flag: '🇽🇰',
        flagImage: '', // No flag image available for Kosovo (XK)
        nativeName: 'Kosovë'
    },
    {
        name: 'Kuwait',
        code: 'KW',
        dialCode: '+965',
        flag: '🇰🇼',
        flagImage: 'assets/images/flags/kw.png',
        nativeName: 'الكويت'
    },
    {
        name: 'Kyrgyzstan',
        code: 'KG',
        dialCode: '+996',
        flag: '🇰🇬',
        flagImage: 'assets/images/flags/kg.png',
        nativeName: 'Кыргызстан'
    },
    // L
    {
        name: 'Laos',
        code: 'LA',
        dialCode: '+856',
        flag: '🇱🇦',
        flagImage: 'assets/images/flags/la.png',
        nativeName: 'ລາວ'
    },
    {
        name: 'Latvia',
        code: 'LV',
        dialCode: '+371',
        flag: '🇱🇻',
        flagImage: 'assets/images/flags/lv.png',
        nativeName: 'Latvija'
    },
    {
        name: 'Lebanon',
        code: 'LB',
        dialCode: '+961',
        flag: '🇱🇧',
        flagImage: 'assets/images/flags/lb.png',
        nativeName: 'لبنان'
    },
    {
        name: 'Lesotho',
        code: 'LS',
        dialCode: '+266',
        flag: '🇱🇸',
        flagImage: 'assets/images/flags/ls.png',
        nativeName: 'Lesotho'
    },
    {
        name: 'Liberia',
        code: 'LR',
        dialCode: '+231',
        flag: '🇱🇷',
        flagImage: 'assets/images/flags/lr.png',
        nativeName: 'Liberia'
    },
    {
        name: 'Libya',
        code: 'LY',
        dialCode: '+218',
        flag: '🇱🇾',
        flagImage: 'assets/images/flags/ly.png',
        nativeName: 'ليبيا'
    },
    {
        name: 'Liechtenstein',
        code: 'LI',
        dialCode: '+423',
        flag: '🇱🇮',
        flagImage: 'assets/images/flags/li.png',
        nativeName: 'Liechtenstein'
    },
    {
        name: 'Lithuania',
        code: 'LT',
        dialCode: '+370',
        flag: '🇱🇹',
        flagImage: 'assets/images/flags/lt.png',
        nativeName: 'Lietuva'
    },
    {
        name: 'Luxembourg',
        code: 'LU',
        dialCode: '+352',
        flag: '🇱🇺',
        flagImage: 'assets/images/flags/lu.png',
        nativeName: 'Lëtzebuerg'
    },
    // M
    {
        name: 'Macau',
        code: 'MO',
        dialCode: '+853',
        flag: '🇲🇴',
        flagImage: 'assets/images/flags/mo.png',
        nativeName: '澳門'
    },
    {
        name: 'Madagascar',
        code: 'MG',
        dialCode: '+261',
        flag: '🇲🇬',
        flagImage: 'assets/images/flags/mg.png',
        nativeName: 'Madagasikara'
    },
    {
        name: 'Malawi',
        code: 'MW',
        dialCode: '+265',
        flag: '🇲🇼',
        flagImage: 'assets/images/flags/mw.png',
        nativeName: 'Malawi'
    },
    {
        name: 'Malaysia',
        code: 'MY',
        dialCode: '+60',
        flag: '🇲🇾',
        flagImage: 'assets/images/flags/my.png',
        nativeName: 'Malaysia'
    },
    {
        name: 'Maldives',
        code: 'MV',
        dialCode: '+960',
        flag: '🇲🇻',
        flagImage: 'assets/images/flags/mv.png',
        nativeName: 'ދިވެހިބަސް'
    },
    {
        name: 'Mali',
        code: 'ML',
        dialCode: '+223',
        flag: '🇲🇱',
        flagImage: 'assets/images/flags/ml.png',
        nativeName: 'Mali'
    },
    {
        name: 'Malta',
        code: 'MT',
        dialCode: '+356',
        flag: '🇲🇹',
        flagImage: 'assets/images/flags/mt.png',
        nativeName: 'Malta'
    },
    {
        name: 'Marshall Islands',
        code: 'MH',
        dialCode: '+692',
        flag: '🇲🇭',
        flagImage: 'assets/images/flags/mh.png',
        nativeName: 'Marshall Islands'
    },
    {
        name: 'Martinique',
        code: 'MQ',
        dialCode: '+596',
        flag: '🇲🇶',
        flagImage: 'assets/images/flags/mq.png',
        nativeName: 'Martinique'
    },
    {
        name: 'Mauritania',
        code: 'MR',
        dialCode: '+222',
        flag: '🇲🇷',
        flagImage: 'assets/images/flags/mr.png',
        nativeName: 'موريتانيا'
    },
    {
        name: 'Mauritius',
        code: 'MU',
        dialCode: '+230',
        flag: '🇲🇺',
        flagImage: 'assets/images/flags/mu.png',
        nativeName: 'Maurice'
    },
    {
        name: 'Mayotte',
        code: 'YT',
        dialCode: '+262',
        flag: '🇫🇷',
        flagImage: 'assets/images/flags/fr.png',
        nativeName: 'Mayotte'
    },
    {
        name: 'Mexico',
        code: 'MX',
        dialCode: '+52',
        flag: '🇲🇽',
        flagImage: 'assets/images/flags/mx.png',
        nativeName: 'México'
    },
    {
        name: 'Micronesia',
        code: 'FM',
        dialCode: '+691',
        flag: '🇫🇲',
        flagImage: 'assets/images/flags/fm.png',
        nativeName: 'Micronesia'
    },
    {
        name: 'Moldova',
        code: 'MD',
        dialCode: '+373',
        flag: '🇲🇩',
        flagImage: 'assets/images/flags/md.png',
        nativeName: 'Republica Moldova'
    },
    {
        name: 'Monaco',
        code: 'MC',
        dialCode: '+377',
        flag: '🇲🇨',
        flagImage: 'assets/images/flags/mc.png',
        nativeName: 'Monaco'
    },
    {
        name: 'Mongolia',
        code: 'MN',
        dialCode: '+976',
        flag: '🇲🇳',
        flagImage: 'assets/images/flags/mn.png',
        nativeName: 'Монгол'
    },
    {
        name: 'Montenegro',
        code: 'ME',
        dialCode: '+382',
        flag: '🇲🇪',
        flagImage: 'assets/images/flags/me.png',
        nativeName: 'Crna Gora'
    },
    {
        name: 'Montserrat',
        code: 'MS',
        dialCode: '+1664',
        flag: '🇲🇸',
        flagImage: 'assets/images/flags/ms.png',
        nativeName: 'Montserrat'
    },
    {
        name: 'Morocco',
        code: 'MA',
        dialCode: '+212',
        flag: '🇲🇦',
        flagImage: 'assets/images/flags/ma.png',
        nativeName: 'المغرب'
    },
    {
        name: 'Mozambique',
        code: 'MZ',
        dialCode: '+258',
        flag: '🇲🇿',
        flagImage: 'assets/images/flags/mz.png',
        nativeName: 'Moçambique'
    },
    {
        name: 'Myanmar',
        code: 'MM',
        dialCode: '+95',
        flag: '🇲🇲',
        flagImage: 'assets/images/flags/mm.png',
        nativeName: 'မြန်မာ'
    },
    // N
    {
        name: 'Namibia',
        code: 'NA',
        dialCode: '+264',
        flag: '🇳🇦',
        flagImage: 'assets/images/flags/na.png',
        nativeName: 'Namibië'
    },
    {
        name: 'Nauru',
        code: 'NR',
        dialCode: '+674',
        flag: '🇳🇷',
        flagImage: 'assets/images/flags/nr.png',
        nativeName: 'Nauru'
    },
    {
        name: 'Nepal',
        code: 'NP',
        dialCode: '+977',
        flag: '🇳🇵',
        flagImage: 'assets/images/flags/np.png',
        nativeName: 'नेपाल'
    },
    {
        name: 'Netherlands',
        code: 'NL',
        dialCode: '+31',
        flag: '🇳🇱',
        flagImage: 'assets/images/flags/nl.png',
        nativeName: 'Nederland'
    },
    {
        name: 'New Caledonia',
        code: 'NC',
        dialCode: '+687',
        flag: '🇳🇨',
        flagImage: 'assets/images/flags/nc.png',
        nativeName: 'Nouvelle-Calédonie'
    },
    {
        name: 'New Zealand',
        code: 'NZ',
        dialCode: '+64',
        flag: '🇳🇿',
        flagImage: 'assets/images/flags/nz.png',
        nativeName: 'New Zealand'
    },
    {
        name: 'Nicaragua',
        code: 'NI',
        dialCode: '+505',
        flag: '🇳🇮',
        flagImage: 'assets/images/flags/ni.png',
        nativeName: 'Nicaragua'
    },
    {
        name: 'Niger',
        code: 'NE',
        dialCode: '+227',
        flag: '🇳🇪',
        flagImage: 'assets/images/flags/ne.png',
        nativeName: 'Nijar'
    },
    {
        name: 'Nigeria',
        code: 'NG',
        dialCode: '+234',
        flag: '🇳🇬',
        flagImage: 'assets/images/flags/ng.png',
        nativeName: 'Nigeria'
    },
    {
        name: 'Niue',
        code: 'NU',
        dialCode: '+683',
        flag: '🇳🇺',
        flagImage: 'assets/images/flags/nu.png',
        nativeName: 'Niue'
    },
    {
        name: 'Norfolk Island',
        code: 'NF',
        dialCode: '+672',
        flag: '🇳🇫',
        flagImage: 'assets/images/flags/nf.png',
        nativeName: 'Norfolk Island'
    },
    {
        name: 'North Korea',
        code: 'KP',
        dialCode: '+850',
        flag: '🇰🇵',
        flagImage: 'assets/images/flags/kp.png',
        nativeName: '조선 민주주의 인민 공화국'
    },
    {
        name: 'North Macedonia',
        code: 'MK',
        dialCode: '+389',
        flag: '🇲🇰',
        flagImage: 'assets/images/flags/mk.png',
        nativeName: '+389'
    },
    {
        name: 'Northern Mariana Islands',
        code: 'MP',
        dialCode: '+1670',
        flag: '🇲🇵',
        flagImage: 'assets/images/flags/mp.png',
        nativeName: 'Northern Mariana Islands'
    },
    {
        name: 'Norway',
        code: 'NO',
        dialCode: '+47',
        flag: '🇳🇴',
        flagImage: 'assets/images/flags/no.png',
        nativeName: 'Norge'
    },
    // O
    {
        name: 'Oman',
        code: 'OM',
        dialCode: '+968',
        flag: '🇴🇲',
        flagImage: 'assets/images/flags/om.png',
        nativeName: 'عُمان'
    },
    // P
    {
        name: 'Pakistan',
        code: 'PK',
        dialCode: '+92',
        flag: '🇵🇰',
        flagImage: 'assets/images/flags/pk.png',
        nativeName: 'پاکستان'
    },
    {
        name: 'Palau',
        code: 'PW',
        dialCode: '+680',
        flag: '🇵🇼',
        flagImage: 'assets/images/flags/pw.png',
        nativeName: 'Palau'
    },
    {
        name: 'Palestine',
        code: 'PS',
        dialCode: '+970',
        flag: '🇵🇸',
        flagImage: 'assets/images/flags/ps.png',
        nativeName: 'فلسطين'
    },
    {
        name: 'Panama',
        code: 'PA',
        dialCode: '+507',
        flag: '🇵🇦',
        flagImage: 'assets/images/flags/pa.png',
        nativeName: 'Panamá'
    },
    {
        name: 'Papua New Guinea',
        code: 'PG',
        dialCode: '+675',
        flag: '🇵🇬',
        flagImage: 'assets/images/flags/pg.png',
        nativeName: 'Papua New Guinea'
    },
    {
        name: 'Paraguay',
        code: 'PY',
        dialCode: '+595',
        flag: '🇵🇾',
        flagImage: 'assets/images/flags/py.png',
        nativeName: 'Paraguay'
    },
    {
        name: 'Peru',
        code: 'PE',
        dialCode: '+51',
        flag: '🇵🇪',
        flagImage: 'assets/images/flags/pe.png',
        nativeName: 'Perú'
    },
    {
        name: 'Philippines',
        code: 'PH',
        dialCode: '+63',
        flag: '🇵🇭',
        flagImage: 'assets/images/flags/ph.png',
        nativeName: 'Philippines'
    },
    {
        name: 'Pitcairn',
        code: 'PN',
        dialCode: '+64',
        flag: '🇵🇳',
        flagImage: 'assets/images/flags/pn.png',
        nativeName: 'Pitcairn Islands'
    },
    {
        name: 'Poland',
        code: 'PL',
        dialCode: '+48',
        flag: '🇵🇱',
        flagImage: 'assets/images/flags/pl.png',
        nativeName: 'Polska'
    },
    {
        name: 'Portugal',
        code: 'PT',
        dialCode: '+351',
        flag: '🇵🇹',
        flagImage: 'assets/images/flags/pt.png',
        nativeName: 'Portugal'
    },
    {
        name: 'Puerto Rico',
        code: 'PR',
        dialCode: '+1',
        flag: '🇵🇷',
        flagImage: 'assets/images/flags/pr.png',
        nativeName: 'Puerto Rico'
    },
    // Q
    {
        name: 'Qatar',
        code: 'QA',
        dialCode: '+974',
        flag: '🇶🇦',
        flagImage: 'assets/images/flags/qa.png',
        nativeName: 'قطر'
    },
    // R
    {
        name: 'Réunion',
        code: 'RE',
        dialCode: '+262',
        flag: '🇫🇷',
        flagImage: 'assets/images/flags/mf.png',
        nativeName: 'La Réunion'
    },
    {
        name: 'Romania',
        code: 'RO',
        dialCode: '+40',
        flag: '🇷🇴',
        flagImage: 'assets/images/flags/ro.png',
        nativeName: 'România'
    },
    {
        name: 'Russia',
        code: 'RU',
        dialCode: '+7',
        flag: '🇷🇺',
        flagImage: 'assets/images/flags/ru.png',
        nativeName: 'Россия'
    },
    {
        name: 'Rwanda',
        code: 'RW',
        dialCode: '+250',
        flag: '🇷🇼',
        flagImage: 'assets/images/flags/rw.png',
        nativeName: 'Rwanda'
    },
    // S
    {
        name: 'Saint Barthélemy',
        code: 'BL',
        dialCode: '+590',
        flag: '🇫🇷',
        flagImage: 'assets/images/flags/fr.png',
        nativeName: 'Saint-Barthélemy'
    },
    {
        name: 'Saint Helena',
        code: 'SH',
        dialCode: '+290',
        flag: '🇸🇭',
        flagImage: 'assets/images/flags/sh.png',
        nativeName: 'Saint Helena'
    },
    {
        name: 'Saint Kitts and Nevis',
        code: 'KN',
        dialCode: '+1869',
        flag: '🇰🇳',
        flagImage: 'assets/images/flags/kn.png',
        nativeName: 'Saint Kitts and Nevis'
    },
    {
        name: 'Saint Lucia',
        code: 'LC',
        dialCode: '+1758',
        flag: '🇱🇨',
        flagImage: 'assets/images/flags/lc.png',
        nativeName: 'Saint Lucia'
    },
    {
        name: 'Saint Martin (France)',
        code: 'MF',
        dialCode: '+590',
        flag: '🇲🇫',
        flagImage: 'assets/images/flags/mf.png',
        nativeName: 'Saint-Martin'
    },
    {
        name: 'Saint Pierre and Miquelon',
        code: 'PM',
        dialCode: '+508',
        flag: '🇫🇷',
        flagImage: 'assets/images/flags/fr.png',
        nativeName: 'Saint-Pierre-et-Miquelon'
    },
    {
        name: 'Saint Vincent and the Grenadines',
        code: 'VC',
        dialCode: '+1784',
        flag: '🇻🇨',
        flagImage: 'assets/images/flags/vc.png',
        nativeName: 'Saint Vincent and the Grenadines'
    },
    {
        name: 'Samoa',
        code: 'WS',
        dialCode: '+685',
        flag: '🇼🇸',
        flagImage: 'assets/images/flags/ws.png',
        nativeName: 'Samoa'
    },
    {
        name: 'San Marino',
        code: 'SM',
        dialCode: '+378',
        flag: '🇸🇲',
        flagImage: 'assets/images/flags/sm.png',
        nativeName: 'San Marino'
    },
    {
        name: 'São Tomé and Príncipe',
        code: 'ST',
        dialCode: '+239',
        flag: '🇸🇹',
        flagImage: 'assets/images/flags/st.png',
        nativeName: 'São Tomé e Príncipe'
    },
    {
        name: 'Saudi Arabia',
        code: 'SA',
        dialCode: '+966',
        flag: '🇸🇦',
        flagImage: 'assets/images/flags/sa.png',
        nativeName: 'المملكة العربية السعودية'
    },
    {
        name: 'Senegal',
        code: 'SN',
        dialCode: '+221',
        flag: '🇸🇳',
        flagImage: 'assets/images/flags/sn.png',
        nativeName: 'Sénégal'
    },
    {
        name: 'Serbia',
        code: 'RS',
        dialCode: '+381',
        flag: '🇷🇸',
        flagImage: 'assets/images/flags/rs.png',
        nativeName: 'Србија'
    },
    {
        name: 'Seychelles',
        code: 'SC',
        dialCode: '+248',
        flag: '🇸🇨',
        flagImage: 'assets/images/flags/sc.png',
        nativeName: 'Seychelles'
    },
    {
        name: 'Sierra Leone',
        code: 'SL',
        dialCode: '+232',
        flag: '🇸🇱',
        flagImage: 'assets/images/flags/sl.png',
        nativeName: 'Sierra Leone'
    },
    {
        name: 'Singapore',
        code: 'SG',
        dialCode: '+65',
        flag: '🇸🇬',
        flagImage: 'assets/images/flags/sg.png',
        nativeName: 'Singapore'
    },
    {
        name: 'Sint Maarten',
        code: 'SX',
        dialCode: '+1721',
        flag: '🇸🇽',
        flagImage: 'assets/images/flags/sx.png',
        nativeName: 'Sint Maarten'
    },
    {
        name: 'Slovakia',
        code: 'SK',
        dialCode: '+421',
        flag: '🇸🇰',
        flagImage: 'assets/images/flags/sk.png',
        nativeName: 'Slovensko'
    },
    {
        name: 'Slovenia',
        code: 'SI',
        dialCode: '+386',
        flag: '🇸🇮',
        flagImage: 'assets/images/flags/si.png',
        nativeName: 'Slovenija'
    },
    {
        name: 'Solomon Islands',
        code: 'SB',
        dialCode: '+677',
        flag: '🇸🇧',
        flagImage: 'assets/images/flags/sb.png',
        nativeName: 'Solomon Islands'
    },
    {
        name: 'Somalia',
        code: 'SO',
        dialCode: '+252',
        flag: '🇸🇴',
        flagImage: 'assets/images/flags/so.png',
        nativeName: 'Soomaaliya'
    },
    {
        name: 'South Africa',
        code: 'ZA',
        dialCode: '+27',
        flag: '🇿🇦',
        flagImage: 'assets/images/flags/za.png',
        nativeName: 'South Africa'
    },
    {
        name: 'South Korea',
        code: 'KR',
        dialCode: '+82',
        flag: '🇰🇷',
        flagImage: 'assets/images/flags/kr.png',
        nativeName: '대한민국'
    },
    {
        name: 'South Sudan',
        code: 'SS',
        dialCode: '+211',
        flag: '🇸🇸',
        flagImage: 'assets/images/flags/ss.png',
        nativeName: 'جنوب السودان'
    },
    {
        name: 'Spain',
        code: 'ES',
        dialCode: '+34',
        flag: '🇪🇸',
        flagImage: 'assets/images/flags/es.png',
        nativeName: 'España'
    },
    {
        name: 'Sri Lanka',
        code: 'LK',
        dialCode: '+94',
        flag: '🇱🇰',
        flagImage: 'assets/images/flags/lk.png',
        nativeName: 'ශ්‍රී ලංකාව'
    },
    {
        name: 'Sudan',
        code: 'SD',
        dialCode: '+249',
        flag: '🇸🇩',
        flagImage: 'assets/images/flags/sd.png',
        nativeName: 'السودان'
    },
    {
        name: 'Suriname',
        code: 'SR',
        dialCode: '+597',
        flag: '🇸🇷',
        flagImage: 'assets/images/flags/sr.png',
        nativeName: 'Suriname'
    },
    {
        name: 'Svalbard and Jan Mayen',
        code: 'SJ',
        dialCode: '+47',
        flag: '🇸🇯',
        flagImage: 'assets/images/flags/sj.png',
        nativeName: 'Svalbard og Jan Mayen'
    },
    {
        name: 'Sweden',
        code: 'SE',
        dialCode: '+46',
        flag: '🇸🇪',
        flagImage: 'assets/images/flags/se.png',
        nativeName: 'Sverige'
    },
    {
        name: 'Switzerland',
        code: 'CH',
        dialCode: '+41',
        flag: '🇨🇭',
        flagImage: 'assets/images/flags/ch.png',
        nativeName: 'Schweiz'
    },
    {
        name: 'Syria',
        code: 'SY',
        dialCode: '+963',
        flag: '🇸🇾',
        flagImage: 'assets/images/flags/sy.png',
        nativeName: 'سوريا'
    },
    // T
    {
        name: 'Taiwan',
        code: 'TW',
        dialCode: '+886',
        flag: '🇹🇼',
        flagImage: 'assets/images/flags/tw.png',
        nativeName: '台灣'
    },
    {
        name: 'Tajikistan',
        code: 'TJ',
        dialCode: '+992',
        flag: '🇹🇯',
        flagImage: 'assets/images/flags/tj.png',
        nativeName: 'Tajikistan'
    },
    {
        name: 'Tanzania',
        code: 'TZ',
        dialCode: '+255',
        flag: '🇹🇿',
        flagImage: 'assets/images/flags/tz.png',
        nativeName: 'Tanzania'
    },
    {
        name: 'Thailand',
        code: 'TH',
        dialCode: '+66',
        flag: '🇹🇭',
        flagImage: 'assets/images/flags/th.png',
        nativeName: 'ไทย'
    },
    {
        name: 'Timor-Leste',
        code: 'TL',
        dialCode: '+670',
        flag: '🇹🇱',
        flagImage: 'assets/images/flags/tl.png',
        nativeName: 'Timor-Leste'
    },
    {
        name: 'Togo',
        code: 'TG',
        dialCode: '+228',
        flag: '🇹🇬',
        flagImage: 'assets/images/flags/tg.png',
        nativeName: 'Togo'
    },
    {
        name: 'Tokelau',
        code: 'TK',
        dialCode: '+690',
        flag: '🇹🇰',
        flagImage: 'assets/images/flags/tk.png',
        nativeName: 'Tokelau'
    },
    {
        name: 'Tonga',
        code: 'TO',
        dialCode: '+676',
        flag: '🇹🇴',
        flagImage: 'assets/images/flags/to.png',
        nativeName: 'Tonga'
    },
    {
        name: 'Trinidad and Tobago',
        code: 'TT',
        dialCode: '+1868',
        flag: '🇹🇹',
        flagImage: 'assets/images/flags/tt.png',
        nativeName: 'Trinidad and Tobago'
    },
    {
        name: 'Tunisia',
        code: 'TN',
        dialCode: '+216',
        flag: '🇹🇳',
        flagImage: 'assets/images/flags/tn.png',
        nativeName: 'تونس'
    },
    {
        name: 'Turkey',
        code: 'TR',
        dialCode: '+90',
        flag: '🇹🇷',
        flagImage: 'assets/images/flags/tr.png',
        nativeName: 'Türkiye'
    },
    {
        name: 'Turkmenistan',
        code: 'TM',
        dialCode: '+993',
        flag: '🇹🇲',
        flagImage: 'assets/images/flags/tm.png',
        nativeName: 'Turkmenistan'
    },
    {
        name: 'Turks and Caicos Islands',
        code: 'TC',
        dialCode: '+1649',
        flag: '🇹🇨',
        flagImage: 'assets/images/flags/tc.png',
        nativeName: 'Turks and Caicos Islands'
    },
    {
        name: 'Tuvalu',
        code: 'TV',
        dialCode: '+688',
        flag: '🇹🇻',
        flagImage: 'assets/images/flags/tv.png',
        nativeName: 'Tuvalu'
    },
    // U
    {
        name: 'Uganda',
        code: 'UG',
        dialCode: '+256',
        flag: '🇺🇬',
        flagImage: 'assets/images/flags/ug.png',
        nativeName: 'Uganda'
    },
    {
        name: 'Ukraine',
        code: 'UA',
        dialCode: '+380',
        flag: '🇺🇦',
        flagImage: 'assets/images/flags/ua.png',
        nativeName: 'Україна'
    },
    {
        name: 'United Arab Emirates',
        code: 'AE',
        dialCode: '+971',
        flag: '🇦🇪',
        flagImage: 'assets/images/flags/ae.png',
        nativeName: 'الإمارات العربية المتحدة'
    },
    // { // Move this in top
    //     name: 'United Kingdom'
    //     code: 'GB'
    //     dialCode: '+44'
    //     flag: '🇬🇧'
    //     flagImage: 'assets/images/flags/gb.png'
    //     nativeName: '+44'
    //
    //
    //
    //
    // },
    // { // Move this in top
    //     name: 'United States'
    //     code: 'US'
    //     dialCode: '+1'
    //     flag: '🇺🇸'
    //     flagImage: 'assets/images/flags/us.png'
    //     nativeName: '+1'
    //
    //
    //
    //
    // },
    {
        name: 'Uruguay',
        code: 'UY',
        dialCode: '+598',
        flag: '🇺🇾',
        flagImage: 'assets/images/flags/uy.png',
        nativeName: 'Uruguay'
    },
    {
        name: 'US Virgin Islands',
        code: 'VI',
        dialCode: '+1340',
        flag: '🇻🇮',
        flagImage: 'assets/images/flags/vi.png',
        nativeName: 'U.S. Virgin Islands'
    },
    {
        name: 'Uzbekistan',
        code: 'UZ',
        dialCode: '+998',
        flag: '🇺🇿',
        flagImage: 'assets/images/flags/uz.png',
        nativeName: 'Oʻzbekiston'
    },
    // V
    {
        name: 'Vanuatu',
        code: 'VU',
        dialCode: '+678',
        flag: '🇻🇺',
        flagImage: 'assets/images/flags/vu.png',
        nativeName: 'Vanuatu'
    },
    {
        name: 'Vatican City',
        code: 'VA',
        dialCode: '+379', // Old +39
        flag: '🇻🇦',
        flagImage: 'assets/images/flags/va.png',
        nativeName: 'Città del Vaticano'
    },
    {
        name: 'Venezuela',
        code: 'VE',
        dialCode: '+58',
        flag: '🇻🇪',
        flagImage: 'assets/images/flags/ve.png',
        nativeName: 'Venezuela'
    },
    {
        name: 'Vietnam',
        code: 'VN',
        dialCode: '+84',
        flag: '🇻🇳',
        flagImage: 'assets/images/flags/vn.png',
        nativeName: 'Việt Nam'
    },
    // W
    {
        name: 'Wallis and Futuna',
        code: 'WF',
        dialCode: '+681',
        flag: '🇫🇷',
        flagImage: 'assets/images/flags/fr.png',
        nativeName: 'Wallis-et-Futuna'
    },
    {
        name: 'Western Sahara',
        code: 'EH',
        dialCode: '+212',
        flag: '🇪🇭',
        flagImage: 'assets/images/flags/eh.png',
        nativeName: 'الصحراء الغربية'
    },
    // Y
    {
        name: 'Yemen',
        code: 'YE',
        dialCode: '+967',
        flag: '🇾🇪',
        flagImage: 'assets/images/flags/ye.png',
        nativeName: 'اليمن'
    },
    // Z
    {
        name: 'Zambia',
        code: 'ZM',
        dialCode: '+260',
        flag: '🇿🇲',
        flagImage: 'assets/images/flags/zm.png',
        nativeName: 'Zambia'
    },
    {
        name: 'Zimbabwe',
        code: 'ZW',
        dialCode: '+263',
        flag: '🇿🇼',
        flagImage: 'assets/images/flags/zw.png',
        nativeName: 'Zimbabwe'
    }
];
