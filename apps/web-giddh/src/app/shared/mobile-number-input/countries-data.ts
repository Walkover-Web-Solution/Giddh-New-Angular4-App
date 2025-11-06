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
        nativeName: '+44'
    },
    // A
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
        nativeName: '+355'
    },
    {
        name: 'Algeria',
        code: 'DZ',
        dialCode: '+213',
        flag: '🇩🇿',
        flagImage: 'assets/images/flags/dz.png',
        nativeName: '+213'
    },
    {
        name: 'American Samoa',
        code: 'AS',
        dialCode: '+1684',
        flag: '🇦🇸',
        flagImage: 'assets/images/flags/as.png',
        nativeName: '+1684'
    },
    {
        name: 'Andorra',
        code: 'AD',
        dialCode: '+376',
        flag: '🇦🇩',
        flagImage: 'assets/images/flags/ad.png',
        nativeName: '+376'
    },
    {
        name: 'Angola',
        code: 'AO',
        dialCode: '+244',
        flag: '🇦🇴',
        flagImage: 'assets/images/flags/ao.png',
        nativeName: '+244'
    },
    {
        name: 'Anguilla',
        code: 'AI',
        dialCode: '+1264',
        flag: '🇦🇮',
        flagImage: 'assets/images/flags/ai.png',
        nativeName: '+1264'
    },
    {
        name: 'Antigua and Barbuda',
        code: 'AG',
        dialCode: '+1268',
        flag: '🇦🇬',
        flagImage: 'assets/images/flags/ag.png',
        nativeName: '+1268'
    },
    {
        name: 'Argentina',
        code: 'AR',
        dialCode: '+54',
        flag: '🇦🇷',
        flagImage: 'assets/images/flags/ar.png',
        nativeName: '+54'
    },
    {
        name: 'Armenia',
        code: 'AM',
        dialCode: '+374',
        flag: '🇦🇲',
        flagImage: 'assets/images/flags/am.png',
        nativeName: '+374'
    },
    {
        name: 'Aruba',
        code: 'AW',
        dialCode: '+297',
        flag: '🇦🇼',
        flagImage: 'assets/images/flags/aw.png',
        nativeName: '+297'
    },
    {
        name: 'Australia',
        code: 'AU',
        dialCode: '+61',
        flag: '🇦🇺',
        flagImage: 'assets/images/flags/au.png',
        nativeName: '+61'
    },
    {
        name: 'Austria',
        code: 'AT',
        dialCode: '+43',
        flag: '🇦🇹',
        flagImage: 'assets/images/flags/at.png',
        nativeName: '+43'
    },
    {
        name: 'Azerbaijan',
        code: 'AZ',
        dialCode: '+994',
        flag: '🇦🇿',
        flagImage: 'assets/images/flags/az.png',
        nativeName: '+994'
    },
    // B
    {
        name: 'Bahamas',
        code: 'BS',
        dialCode: '+1242',
        flag: '🇧🇸',
        flagImage: 'assets/images/flags/bs.png',
        nativeName: '+1242'
    },
    {
        name: 'Bahrain',
        code: 'BH',
        dialCode: '+973',
        flag: '🇧🇭',
        flagImage: 'assets/images/flags/bh.png',
        nativeName: '+973'
    },
    {
        name: 'Bangladesh',
        code: 'BD',
        dialCode: '+880',
        flag: '🇧🇩',
        flagImage: 'assets/images/flags/bd.png',
        nativeName: '+880'
    },
    {
        name: 'Barbados',
        code: 'BB',
        dialCode: '+1246',
        flag: '🇧🇧',
        flagImage: 'assets/images/flags/bb.png',
        nativeName: '+1246'
    },
    {
        name: 'Belarus',
        code: 'BY',
        dialCode: '+375',
        flag: '🇧🇾',
        flagImage: 'assets/images/flags/by.png',
        nativeName: '+375'
    },
    {
        name: 'Belgium',
        code: 'BE',
        dialCode: '+32',
        flag: '🇧🇪',
        flagImage: 'assets/images/flags/be.png',
        nativeName: '+32'
    },
    {
        name: 'Belize',
        code: 'BZ',
        dialCode: '+501',
        flag: '🇧🇿',
        flagImage: 'assets/images/flags/bz.png',
        nativeName: '+501'
    },
    {
        name: 'Benin',
        code: 'BJ',
        dialCode: '+229',
        flag: '🇧🇯',
        flagImage: 'assets/images/flags/bj.png',
        nativeName: '+229'
    },
    {
        name: 'Bermuda',
        code: 'BM',
        dialCode: '+1441',
        flag: '🇧🇲',
        flagImage: 'assets/images/flags/bm.png',
        nativeName: '+1441'
    },
    {
        name: 'Bhutan',
        code: 'BT',
        dialCode: '+975',
        flag: '🇧🇹',
        flagImage: 'assets/images/flags/bt.png',
        nativeName: '+975'
    },
    {
        name: 'Bolivia',
        code: 'BO',
        dialCode: '+591',
        flag: '🇧🇴',
        flagImage: 'assets/images/flags/bo.png',
        nativeName: '+591'
    },
    {
        name: 'Bosnia and Herzegovina',
        code: 'BA',
        dialCode: '+387',
        flag: '🇧🇦',
        flagImage: 'assets/images/flags/ba.png',
        nativeName: '+387'
    },
    {
        name: 'Botswana',
        code: 'BW',
        dialCode: '+267',
        flag: '🇧🇼',
        flagImage: 'assets/images/flags/bw.png',
        nativeName: '+267'
    },
    {
        name: 'Brazil',
        code: 'BR',
        dialCode: '+55',
        flag: '🇧🇷',
        flagImage: 'assets/images/flags/br.png',
        nativeName: '+55'
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
        nativeName: '+673'
    },
    {
        name: 'Bulgaria',
        code: 'BG',
        dialCode: '+359',
        flag: '🇧🇬',
        flagImage: 'assets/images/flags/bg.png',
        nativeName: '+359'
    },
    {
        name: 'Burkina Faso',
        code: 'BF',
        dialCode: '+226',
        flag: '🇧🇫',
        flagImage: 'assets/images/flags/bf.png',
        nativeName: '+226'
    },
    {
        name: 'Burundi',
        code: 'BI',
        dialCode: '+257',
        flag: '🇧🇮',
        flagImage: 'assets/images/flags/bi.png',
        nativeName: '+257'
    },
    // C
    {
        name: 'Cambodia',
        code: 'KH',
        dialCode: '+855',
        flag: '🇰🇭',
        flagImage: 'assets/images/flags/kh.png',
        nativeName: '+855'
    },
    {
        name: 'Cameroon',
        code: 'CM',
        dialCode: '+237',
        flag: '🇨🇲',
        flagImage: 'assets/images/flags/cm.png',
        nativeName: '+237'
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
        nativeName: '+238'
    },
    {
        name: 'Cayman Islands',
        code: 'KY',
        dialCode: '+1345',
        flag: '🇰🇾',
        flagImage: 'assets/images/flags/ky.png',
        nativeName: '+1345'
    },
    {
        name: 'Central African Republic',
        code: 'CF',
        dialCode: '+236',
        flag: '🇨🇫',
        flagImage: 'assets/images/flags/cf.png',
        nativeName: '+236'
    },
    {
        name: 'Chad',
        code: 'TD',
        dialCode: '+235',
        flag: '🇹🇩',
        flagImage: 'assets/images/flags/td.png',
        nativeName: '+235'
    },
    {
        name: 'Chile',
        code: 'CL',
        dialCode: '+56',
        flag: '🇨🇱',
        flagImage: 'assets/images/flags/cl.png',
        nativeName: '+56'
    },
    {
        name: 'China',
        code: 'CN',
        dialCode: '+86',
        flag: '🇨🇳',
        flagImage: 'assets/images/flags/cn.png',
        nativeName: '+86'
    },
    {
        name: 'Colombia',
        code: 'CO',
        dialCode: '+57',
        flag: '🇨🇴',
        flagImage: 'assets/images/flags/co.png',
        nativeName: '+57'
    },
    {
        name: 'Comoros',
        code: 'KM',
        dialCode: '+269',
        flag: '🇰🇲',
        flagImage: 'assets/images/flags/km.png',
        nativeName: '+269'
    },
    {
        name: 'Congo',
        code: 'CG',
        dialCode: '+242',
        flag: '🇨🇬',
        flagImage: 'assets/images/flags/cg.png',
        nativeName: '+242'
    },
    {
        name: 'Democratic Republic of the Congo',
        code: 'CD',
        dialCode: '+243',
        flag: '🇨🇩',
        flagImage: 'assets/images/flags/cd.png',
        nativeName: '+243'
    },
    {
        name: 'Cook Islands',
        code: 'CK',
        dialCode: '+682',
        flag: '🇨🇰',
        flagImage: 'assets/images/flags/ck.png',
        nativeName: '+682'
    },
    {
        name: 'Costa Rica',
        code: 'CR',
        dialCode: '+506',
        flag: '🇨🇷',
        flagImage: 'assets/images/flags/cr.png',
        nativeName: '+506'
    },
    {
        name: 'Croatia',
        code: 'HR',
        dialCode: '+385',
        flag: '🇭🇷',
        flagImage: 'assets/images/flags/hr.png',
        nativeName: '+385'
    },
    {
        name: 'Cuba',
        code: 'CU',
        dialCode: '+53',
        flag: '🇨🇺',
        flagImage: 'assets/images/flags/cu.png',
        nativeName: '+53'
    },
    {
        name: 'Cyprus',
        code: 'CY',
        dialCode: '+357',
        flag: '🇨🇾',
        flagImage: 'assets/images/flags/cy.png',
        nativeName: '+357'
    },
    {
        name: 'Czech Republic',
        code: 'CZ',
        dialCode: '+420',
        flag: '🇨🇿',
        flagImage: 'assets/images/flags/cz.png',
        nativeName: '+420'
    },
    // D
    {
        name: 'Denmark',
        code: 'DK',
        dialCode: '+45',
        flag: '🇩🇰',
        flagImage: 'assets/images/flags/dk.png',
        nativeName: '+45'
    },
    {
        name: 'Djibouti',
        code: 'DJ',
        dialCode: '+253',
        flag: '🇩🇯',
        flagImage: 'assets/images/flags/dj.png',
        nativeName: '+253'
    },
    {
        name: 'Dominica',
        code: 'DM',
        dialCode: '+1767',
        flag: '🇩🇲',
        flagImage: 'assets/images/flags/dm.png',
        nativeName: '+1767'
    },
    {
        name: 'Dominican Republic',
        code: 'DO',
        dialCode: '+1809',
        flag: '🇩🇴',
        flagImage: 'assets/images/flags/do.png',
        nativeName: '+1'
    },
    // E
    {
        name: 'Ecuador',
        code: 'EC',
        dialCode: '+593',
        flag: '🇪🇨',
        flagImage: 'assets/images/flags/ec.png',
        nativeName: '+593'
    },
    {
        name: 'Egypt',
        code: 'EG',
        dialCode: '+20',
        flag: '🇪🇬',
        flagImage: 'assets/images/flags/eg.png',
        nativeName: '+20'
    },
    {
        name: 'El Salvador',
        code: 'SV',
        dialCode: '+503',
        flag: '🇸🇻',
        flagImage: 'assets/images/flags/sv.png',
        nativeName: '+503'
    },
    {
        name: 'Equatorial Guinea',
        code: 'GQ',
        dialCode: '+240',
        flag: '🇬🇶',
        flagImage: 'assets/images/flags/gq.png',
        nativeName: '+240'
    },
    {
        name: 'Eritrea',
        code: 'ER',
        dialCode: '+291',
        flag: '🇪🇷',
        flagImage: 'assets/images/flags/er.png',
        nativeName: '+291'
    },
    {
        name: 'Estonia',
        code: 'EE',
        dialCode: '+372',
        flag: '🇪🇪',
        flagImage: 'assets/images/flags/ee.png',
        nativeName: '+372'
    },
    {
        name: 'Ethiopia',
        code: 'ET',
        dialCode: '+251',
        flag: '🇪🇹',
        flagImage: 'assets/images/flags/et.png',
        nativeName: '+251'
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
        nativeName: '+298'
    },
    {
        name: 'Fiji',
        code: 'FJ',
        dialCode: '+679',
        flag: '🇫🇯',
        flagImage: 'assets/images/flags/fj.png',
        nativeName: '+679'
    },
    {
        name: 'Finland',
        code: 'FI',
        dialCode: '+358',
        flag: '🇫🇮',
        flagImage: 'assets/images/flags/fi.png',
        nativeName: '+358'
    },
    {
        name: 'France',
        code: 'FR',
        dialCode: '+33',
        flag: '🇫🇷',
        flagImage: 'assets/images/flags/fr.png',
        nativeName: '+33'
    },
    {
        name: 'French Guiana',
        code: 'GF',
        dialCode: '+594',
        flag: '🇬🇫',
        flagImage: 'assets/images/flags/gf.png',
        nativeName: '+594'
    },
    {
        name: 'French Polynesia',
        code: 'PF',
        dialCode: '+689',
        flag: '🇵🇫',
        flagImage: 'assets/images/flags/pf.png',
        nativeName: '+689'
    },
    // G
    {
        name: 'Gabon',
        code: 'GA',
        dialCode: '+241',
        flag: '🇬🇦',
        flagImage: 'assets/images/flags/ga.png',
        nativeName: '+241'
    },
    {
        name: 'Gambia',
        code: 'GM',
        dialCode: '+220',
        flag: '🇬🇲',
        flagImage: 'assets/images/flags/gm.png',
        nativeName: '+220'
    },
    {
        name: 'Georgia',
        code: 'GE',
        dialCode: '+995',
        flag: '🇬🇪',
        flagImage: 'assets/images/flags/ge.png',
        nativeName: '+995'
    },
    {
        name: 'Germany',
        code: 'DE',
        dialCode: '+49',
        flag: '🇩🇪',
        flagImage: 'assets/images/flags/de.png',
        nativeName: '+49'
    },
    {
        name: 'Ghana',
        code: 'GH',
        dialCode: '+233',
        flag: '🇬🇭',
        flagImage: 'assets/images/flags/gh.png',
        nativeName: '+233'
    },
    {
        name: 'Gibraltar',
        code: 'GI',
        dialCode: '+350',
        flag: '🇬🇮',
        flagImage: 'assets/images/flags/gi.png',
        nativeName: '+350'
    },
    {
        name: 'Greece',
        code: 'GR',
        dialCode: '+30',
        flag: '🇬🇷',
        flagImage: 'assets/images/flags/gr.png',
        nativeName: '+30'
    },
    {
        name: 'Greenland',
        code: 'GL',
        dialCode: '+299',
        flag: '🇬🇱',
        flagImage: 'assets/images/flags/gl.png',
        nativeName: '+299'
    },
    {
        name: 'Grenada',
        code: 'GD',
        dialCode: '+1473',
        flag: '🇬🇩',
        flagImage: 'assets/images/flags/gd.png',
        nativeName: '+1473'
    },
    {
        name: 'Guadeloupe',
        code: 'GP',
        dialCode: '+590',
        flag: '🇬🇵',
        flagImage: 'assets/images/flags/gp.png',
        nativeName: '+590'
    },
    {
        name: 'Guam',
        code: 'GU',
        dialCode: '+1671',
        flag: '🇬🇺',
        flagImage: 'assets/images/flags/gu.png',
        nativeName: 'Guam'
    },
    {
        name: 'Guatemala',
        code: 'GT',
        dialCode: '+502',
        flag: '🇬🇹',
        flagImage: 'assets/images/flags/gt.png',
        nativeName: '+502'
    },
    {
        name: 'Guernsey',
        code: 'GG',
        dialCode: '+44',
        flag: '🇬🇬',
        flagImage: 'assets/images/flags/gg.png',
        nativeName: '+44'
    },
    {
        name: 'Guinea',
        code: 'GN',
        dialCode: '+224',
        flag: '🇬🇳',
        flagImage: 'assets/images/flags/gn.png',
        nativeName: '+224'
    },
    {
        name: 'Guinea-Bissau',
        code: 'GW',
        dialCode: '+245',
        flag: '🇬🇼',
        flagImage: 'assets/images/flags/gw.png',
        nativeName: '+245'
    },
    {
        name: 'Guyana',
        code: 'GY',
        dialCode: '+592',
        flag: '🇬🇾',
        flagImage: 'assets/images/flags/gy.png',
        nativeName: '+592'
    },
    // H
    {
        name: 'Haiti',
        code: 'HT',
        dialCode: '+509',
        flag: '🇭🇹',
        flagImage: 'assets/images/flags/ht.png',
        nativeName: '+509'
    },
    {
        name: 'Honduras',
        code: 'HN',
        dialCode: '+504',
        flag: '🇭🇳',
        flagImage: 'assets/images/flags/hn.png',
        nativeName: '+504'
    },
    {
        name: 'Hong Kong',
        code: 'HK',
        dialCode: '+852',
        flag: '🇭🇰',
        flagImage: 'assets/images/flags/hk.png',
        nativeName: '+852'
    },
    {
        name: 'Hungary',
        code: 'HU',
        dialCode: '+36',
        flag: '🇭🇺',
        flagImage: 'assets/images/flags/hu.png',
        nativeName: '+36'
    },
    // I
    {
        name: 'Iceland',
        code: 'IS',
        dialCode: '+354',
        flag: '🇮🇸',
        flagImage: 'assets/images/flags/is.png',
        nativeName: '+354'
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
        nativeName: '+62'
    },
    {
        name: 'Iran',
        code: 'IR',
        dialCode: '+98',
        flag: '🇮🇷',
        flagImage: 'assets/images/flags/ir.png',
        nativeName: '+98'
    },
    {
        name: 'Iraq',
        code: 'IQ',
        dialCode: '+964',
        flag: '🇮🇶',
        flagImage: 'assets/images/flags/iq.png',
        nativeName: '+964'
    },
    {
        name: 'Ireland',
        code: 'IE',
        dialCode: '+353',
        flag: '🇮🇪',
        flagImage: 'assets/images/flags/ie.png',
        nativeName: '+353'
    },
    {
        name: 'Isle of Man',
        code: 'IM',
        dialCode: '+44',
        flag: '🇮🇲',
        flagImage: 'assets/images/flags/im.png',
        nativeName: '+44'
    },
    {
        name: 'Israel',
        code: 'IL',
        dialCode: '+972',
        flag: '🇮🇱',
        flagImage: 'assets/images/flags/il.png',
        nativeName: '+972'
    },
    {
        name: 'Italy',
        code: 'IT',
        dialCode: '+39',
        flag: '🇮🇹',
        flagImage: 'assets/images/flags/it.png',
        nativeName: '+39'
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
        nativeName: '+1876'
    },
    {
        name: 'Japan',
        code: 'JP',
        dialCode: '+81',
        flag: '🇯🇵',
        flagImage: 'assets/images/flags/jp.png',
        nativeName: '+81'
    },
    {
        name: 'Jersey',
        code: 'JE',
        dialCode: '+44',
        flag: '🇯🇪',
        flagImage: 'assets/images/flags/je.png',
        nativeName: '+44'
    },
    {
        name: 'Jordan',
        code: 'JO',
        dialCode: '+962',
        flag: '🇯🇴',
        flagImage: 'assets/images/flags/jo.png',
        nativeName: '+962'
    },
    // K
    {
        name: 'Kazakhstan',
        code: 'KZ',
        dialCode: '+7',
        flag: '🇰🇿',
        flagImage: 'assets/images/flags/kz.png',
        nativeName: '+7'
    },
    {
        name: 'Kenya',
        code: 'KE',
        dialCode: '+254',
        flag: '🇰🇪',
        flagImage: 'assets/images/flags/ke.png',
        nativeName: '+254'
    },
    {
        name: 'Kiribati',
        code: 'KI',
        dialCode: '+686',
        flag: '🇰🇮',
        flagImage: 'assets/images/flags/ki.png',
        nativeName: '+686'
    },
    {
        name: 'Kosovo',
        code: 'XK',
        dialCode: '+383',
        flag: '🇽🇰',
        flagImage: '', // No flag image available for Kosovo (XK)
        nativeName: '+383'
    },
    {
        name: 'Kuwait',
        code: 'KW',
        dialCode: '+965',
        flag: '🇰🇼',
        flagImage: 'assets/images/flags/kw.png',
        nativeName: '+965'
    },
    {
        name: 'Kyrgyzstan',
        code: 'KG',
        dialCode: '+996',
        flag: '🇰🇬',
        flagImage: 'assets/images/flags/kg.png',
        nativeName: '+996'
    },
    // L
    {
        name: 'Laos',
        code: 'LA',
        dialCode: '+856',
        flag: '🇱🇦',
        flagImage: 'assets/images/flags/la.png',
        nativeName: '+856'
    },
    {
        name: 'Latvia',
        code: 'LV',
        dialCode: '+371',
        flag: '🇱🇻',
        flagImage: 'assets/images/flags/lv.png',
        nativeName: '+371'
    },
    {
        name: 'Lebanon',
        code: 'LB',
        dialCode: '+961',
        flag: '🇱🇧',
        flagImage: 'assets/images/flags/lb.png',
        nativeName: '+961'
    },
    {
        name: 'Lesotho',
        code: 'LS',
        dialCode: '+266',
        flag: '🇱🇸',
        flagImage: 'assets/images/flags/ls.png',
        nativeName: '+266'
    },
    {
        name: 'Liberia',
        code: 'LR',
        dialCode: '+231',
        flag: '🇱🇷',
        flagImage: 'assets/images/flags/lr.png',
        nativeName: '+231'
    },
    {
        name: 'Libya',
        code: 'LY',
        dialCode: '+218',
        flag: '🇱🇾',
        flagImage: 'assets/images/flags/ly.png',
        nativeName: '+218'
    },
    {
        name: 'Liechtenstein',
        code: 'LI',
        dialCode: '+423',
        flag: '🇱🇮',
        flagImage: 'assets/images/flags/li.png',
        nativeName: '+423'
    },
    {
        name: 'Lithuania',
        code: 'LT',
        dialCode: '+370',
        flag: '🇱🇹',
        flagImage: 'assets/images/flags/lt.png',
        nativeName: '+370'
    },
    {
        name: 'Luxembourg',
        code: 'LU',
        dialCode: '+352',
        flag: '🇱🇺',
        flagImage: 'assets/images/flags/lu.png',
        nativeName: '+352'
    },
    // M
    {
        name: 'Macau',
        code: 'MO',
        dialCode: '+853',
        flag: '🇲🇴',
        flagImage: 'assets/images/flags/mo.png',
        nativeName: '+853'
    },
    {
        name: 'Madagascar',
        code: 'MG',
        dialCode: '+261',
        flag: '🇲🇬',
        flagImage: 'assets/images/flags/mg.png',
        nativeName: '+261'
    },
    {
        name: 'Malawi',
        code: 'MW',
        dialCode: '+265',
        flag: '🇲🇼',
        flagImage: 'assets/images/flags/mw.png',
        nativeName: '+265'
    },
    {
        name: 'Malaysia',
        code: 'MY',
        dialCode: '+60',
        flag: '🇲🇾',
        flagImage: 'assets/images/flags/my.png',
        nativeName: '+60'
    },
    {
        name: 'Maldives',
        code: 'MV',
        dialCode: '+960',
        flag: '🇲🇻',
        flagImage: 'assets/images/flags/mv.png',
        nativeName: '+960'
    },
    {
        name: 'Mali',
        code: 'ML',
        dialCode: '+223',
        flag: '🇲🇱',
        flagImage: 'assets/images/flags/ml.png',
        nativeName: '+223'
    },
    {
        name: 'Malta',
        code: 'MT',
        dialCode: '+356',
        flag: '🇲🇹',
        flagImage: 'assets/images/flags/mt.png',
        nativeName: '+356'
    },
    {
        name: 'Marshall Islands',
        code: 'MH',
        dialCode: '+692',
        flag: '🇲🇭',
        flagImage: 'assets/images/flags/mh.png',
        nativeName: '+692'
    },
    {
        name: 'Martinique',
        code: 'MQ',
        dialCode: '+596',
        flag: '🇲🇶',
        flagImage: 'assets/images/flags/mq.png',
        nativeName: '+596'
    },
    {
        name: 'Mauritania',
        code: 'MR',
        dialCode: '+222',
        flag: '🇲🇷',
        flagImage: 'assets/images/flags/mr.png',
        nativeName: '+222'
    },
    {
        name: 'Mauritius',
        code: 'MU',
        dialCode: '+230',
        flag: '🇲🇺',
        flagImage: 'assets/images/flags/mu.png',
        nativeName: '+230'
    },
    {
        name: 'Mayotte',
        code: 'YT',
        dialCode: '+262',
        flag: '🇾🇹',
        flagImage: 'assets/images/flags/yt.png',
        nativeName: '+262'
    },
    {
        name: 'Mexico',
        code: 'MX',
        dialCode: '+52',
        flag: '🇲🇽',
        flagImage: 'assets/images/flags/mx.png',
        nativeName: '+52'
    },
    {
        name: 'Micronesia',
        code: 'FM',
        dialCode: '+691',
        flag: '🇫🇲',
        flagImage: 'assets/images/flags/fm.png',
        nativeName: '+691'
    },
    {
        name: 'Moldova',
        code: 'MD',
        dialCode: '+373',
        flag: '🇲🇩',
        flagImage: 'assets/images/flags/md.png',
        nativeName: '+373'
    },
    {
        name: 'Monaco',
        code: 'MC',
        dialCode: '+377',
        flag: '🇲🇨',
        flagImage: 'assets/images/flags/mc.png',
        nativeName: '+377'
    },
    {
        name: 'Mongolia',
        code: 'MN',
        dialCode: '+976',
        flag: '🇲🇳',
        flagImage: 'assets/images/flags/mn.png',
        nativeName: '+976'
    },
    {
        name: 'Montenegro',
        code: 'ME',
        dialCode: '+382',
        flag: '🇲🇪',
        flagImage: 'assets/images/flags/me.png',
        nativeName: '+382'
    },
    {
        name: 'Montserrat',
        code: 'MS',
        dialCode: '+1664',
        flag: '🇲🇸',
        flagImage: 'assets/images/flags/ms.png',
        nativeName: '+1664'
    },
    {
        name: 'Morocco',
        code: 'MA',
        dialCode: '+212',
        flag: '🇲🇦',
        flagImage: 'assets/images/flags/ma.png',
        nativeName: '+212'
    },
    {
        name: 'Mozambique',
        code: 'MZ',
        dialCode: '+258',
        flag: '🇲🇿',
        flagImage: 'assets/images/flags/mz.png',
        nativeName: '+258'
    },
    {
        name: 'Myanmar',
        code: 'MM',
        dialCode: '+95',
        flag: '🇲🇲',
        flagImage: 'assets/images/flags/mm.png',
        nativeName: '+95'
    },
    // N
    {
        name: 'Namibia',
        code: 'NA',
        dialCode: '+264',
        flag: '🇳🇦',
        flagImage: 'assets/images/flags/na.png',
        nativeName: '+264'
    },
    {
        name: 'Nauru',
        code: 'NR',
        dialCode: '+674',
        flag: '🇳🇷',
        flagImage: 'assets/images/flags/nr.png',
        nativeName: '+674'
    },
    {
        name: 'Nepal',
        code: 'NP',
        dialCode: '+977',
        flag: '🇳🇵',
        flagImage: 'assets/images/flags/np.png',
        nativeName: '+977'
    },
    {
        name: 'Netherlands',
        code: 'NL',
        dialCode: '+31',
        flag: '🇳🇱',
        flagImage: 'assets/images/flags/nl.png',
        nativeName: '+31'
    },
    {
        name: 'New Caledonia',
        code: 'NC',
        dialCode: '+687',
        flag: '🇳🇨',
        flagImage: 'assets/images/flags/nc.png',
        nativeName: '+687'
    },
    {
        name: 'New Zealand',
        code: 'NZ',
        dialCode: '+64',
        flag: '🇳🇿',
        flagImage: 'assets/images/flags/nz.png',
        nativeName: '+64'
    },
    {
        name: 'Nicaragua',
        code: 'NI',
        dialCode: '+505',
        flag: '🇳🇮',
        flagImage: 'assets/images/flags/ni.png',
        nativeName: '+505'
    },
    {
        name: 'Niger',
        code: 'NE',
        dialCode: '+227',
        flag: '🇳🇪',
        flagImage: 'assets/images/flags/ne.png',
        nativeName: '+227'
    },
    {
        name: 'Nigeria',
        code: 'NG',
        dialCode: '+234',
        flag: '🇳🇬',
        flagImage: 'assets/images/flags/ng.png',
        nativeName: '+234'
    },
    {
        name: 'Niue',
        code: 'NU',
        dialCode: '+683',
        flag: '🇳🇺',
        flagImage: 'assets/images/flags/nu.png',
        nativeName: '+683'
    },
    {
        name: 'Norfolk Island',
        code: 'NF',
        dialCode: '+672',
        flag: '🇳🇫',
        flagImage: 'assets/images/flags/nf.png',
        nativeName: '+672'
    },
    {
        name: 'North Korea',
        code: 'KP',
        dialCode: '+850',
        flag: '🇰🇵',
        flagImage: 'assets/images/flags/kp.png',
        nativeName: '+850'
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
        nativeName: '+1670'
    },
    {
        name: 'Norway',
        code: 'NO',
        dialCode: '+47',
        flag: '🇳🇴',
        flagImage: 'assets/images/flags/no.png',
        nativeName: '+47'
    },
    // O
    {
        name: 'Oman',
        code: 'OM',
        dialCode: '+968',
        flag: '🇴🇲',
        flagImage: 'assets/images/flags/om.png',
        nativeName: '+968'
    },
    // P
    {
        name: 'Pakistan',
        code: 'PK',
        dialCode: '+92',
        flag: '🇵🇰',
        flagImage: 'assets/images/flags/pk.png',
        nativeName: '+92'
    },
    {
        name: 'Palau',
        code: 'PW',
        dialCode: '+680',
        flag: '🇵🇼',
        flagImage: 'assets/images/flags/pw.png',
        nativeName: '+680'
    },
    {
        name: 'Palestine',
        code: 'PS',
        dialCode: '+970',
        flag: '🇵🇸',
        flagImage: 'assets/images/flags/ps.png',
        nativeName: '+970'
    },
    {
        name: 'Panama',
        code: 'PA',
        dialCode: '+507',
        flag: '🇵🇦',
        flagImage: 'assets/images/flags/pa.png',
        nativeName: '+507'
    },
    {
        name: 'Papua New Guinea',
        code: 'PG',
        dialCode: '+675',
        flag: '🇵🇬',
        flagImage: 'assets/images/flags/pg.png',
        nativeName: '+675'
    },
    {
        name: 'Paraguay',
        code: 'PY',
        dialCode: '+595',
        flag: '🇵🇾',
        flagImage: 'assets/images/flags/py.png',
        nativeName: '+595'
    },
    {
        name: 'Peru',
        code: 'PE',
        dialCode: '+51',
        flag: '🇵🇪',
        flagImage: 'assets/images/flags/pe.png',
        nativeName: '+51'
    },
    {
        name: 'Philippines',
        code: 'PH',
        dialCode: '+63',
        flag: '🇵🇭',
        flagImage: 'assets/images/flags/ph.png',
        nativeName: '+63'
    },
    {
        name: 'Pitcairn',
        code: 'PN',
        dialCode: '+64',
        flag: '🇵🇳',
        flagImage: 'assets/images/flags/pn.png',
        nativeName: '+64'
    },
    {
        name: 'Poland',
        code: 'PL',
        dialCode: '+48',
        flag: '🇵🇱',
        flagImage: 'assets/images/flags/pl.png',
        nativeName: '+48'
    },
    {
        name: 'Portugal',
        code: 'PT',
        dialCode: '+351',
        flag: '🇵🇹',
        flagImage: 'assets/images/flags/pt.png',
        nativeName: '+351'
    },
    {
        name: 'Puerto Rico',
        code: 'PR',
        dialCode: '+1',
        flag: '🇵🇷',
        flagImage: 'assets/images/flags/pr.png',
        nativeName: '+1'
    },
    // Q
    {
        name: 'Qatar',
        code: 'QA',
        dialCode: '+974',
        flag: '🇶🇦',
        flagImage: 'assets/images/flags/qa.png',
        nativeName: '+974'
    },
    // R
    {
        name: 'Réunion',
        code: 'RE',
        dialCode: '+262',
        flag: '🇷🇪',
        flagImage: 'assets/images/flags/re.png',
        nativeName: '+262'
    },
    {
        name: 'Romania',
        code: 'RO',
        dialCode: '+40',
        flag: '🇷🇴',
        flagImage: 'assets/images/flags/ro.png',
        nativeName: '+40'
    },
    {
        name: 'Russia',
        code: 'RU',
        dialCode: '+7',
        flag: '🇷🇺',
        flagImage: 'assets/images/flags/ru.png',
        nativeName: '+7'
    },
    {
        name: 'Rwanda',
        code: 'RW',
        dialCode: '+250',
        flag: '🇷🇼',
        flagImage: 'assets/images/flags/rw.png',
        nativeName: '+250'
    },
    // S
    {
        name: 'Saint Helena',
        code: 'SH',
        dialCode: '+290',
        flag: '🇸🇭',
        flagImage: 'assets/images/flags/sh.png',
        nativeName: '+290'
    },
    {
        name: 'Saint Kitts and Nevis',
        code: 'KN',
        dialCode: '+1869',
        flag: '🇰🇳',
        flagImage: 'assets/images/flags/kn.png',
        nativeName: '+1869'
    },
    {
        name: 'Saint Lucia',
        code: 'LC',
        dialCode: '+1758',
        flag: '🇱🇨',
        flagImage: 'assets/images/flags/lc.png',
        nativeName: '+1758'
    },
    {
        name: 'Saint Pierre and Miquelon',
        code: 'PM',
        dialCode: '+508',
        flag: '🇵🇲',
        flagImage: 'assets/images/flags/pm.png',
        nativeName: '+508'
    },
    {
        name: 'Saint Vincent and the Grenadines',
        code: 'VC',
        dialCode: '+1784',
        flag: '🇻🇨',
        flagImage: 'assets/images/flags/vc.png',
        nativeName: '+1784'
    },
    {
        name: 'Samoa',
        code: 'WS',
        dialCode: '+685',
        flag: '🇼🇸',
        flagImage: 'assets/images/flags/ws.png',
        nativeName: '+685'
    },
    {
        name: 'San Marino',
        code: 'SM',
        dialCode: '+378',
        flag: '🇸🇲',
        flagImage: 'assets/images/flags/sm.png',
        nativeName: '+378'
    },
    {
        name: 'São Tomé and Príncipe',
        code: 'ST',
        dialCode: '+239',
        flag: '🇸🇹',
        flagImage: 'assets/images/flags/st.png',
        nativeName: '+239'
    },
    {
        name: 'Saudi Arabia',
        code: 'SA',
        dialCode: '+966',
        flag: '🇸🇦',
        flagImage: 'assets/images/flags/sa.png',
        nativeName: '+966'
    },
    {
        name: 'Senegal',
        code: 'SN',
        dialCode: '+221',
        flag: '🇸🇳',
        flagImage: 'assets/images/flags/sn.png',
        nativeName: '+221'
    },
    {
        name: 'Serbia',
        code: 'RS',
        dialCode: '+381',
        flag: '🇷🇸',
        flagImage: 'assets/images/flags/rs.png',
        nativeName: '+381'
    },
    {
        name: 'Seychelles',
        code: 'SC',
        dialCode: '+248',
        flag: '🇸🇨',
        flagImage: 'assets/images/flags/sc.png',
        nativeName: '+248'
    },
    {
        name: 'Sierra Leone',
        code: 'SL',
        dialCode: '+232',
        flag: '🇸🇱',
        flagImage: 'assets/images/flags/sl.png',
        nativeName: '+232'
    },
    {
        name: 'Singapore',
        code: 'SG',
        dialCode: '+65',
        flag: '🇸🇬',
        flagImage: 'assets/images/flags/sg.png',
        nativeName: '+65'
    },
    {
        name: 'Sint Maarten',
        code: 'SX',
        dialCode: '+1721',
        flag: '🇸🇽',
        flagImage: 'assets/images/flags/sx.png',
        nativeName: '+1721'
    },
    {
        name: 'Slovakia',
        code: 'SK',
        dialCode: '+421',
        flag: '🇸🇰',
        flagImage: 'assets/images/flags/sk.png',
        nativeName: '+421'
    },
    {
        name: 'Slovenia',
        code: 'SI',
        dialCode: '+386',
        flag: '🇸🇮',
        flagImage: 'assets/images/flags/si.png',
        nativeName: '+386'
    },
    {
        name: 'Solomon Islands',
        code: 'SB',
        dialCode: '+677',
        flag: '🇸🇧',
        flagImage: 'assets/images/flags/sb.png',
        nativeName: '+677'
    },
    {
        name: 'Somalia',
        code: 'SO',
        dialCode: '+252',
        flag: '🇸🇴',
        flagImage: 'assets/images/flags/so.png',
        nativeName: '+252'
    },
    {
        name: 'South Africa',
        code: 'ZA',
        dialCode: '+27',
        flag: '🇿🇦',
        flagImage: 'assets/images/flags/za.png',
        nativeName: '+27'
    },
    {
        name: 'South Korea',
        code: 'KR',
        dialCode: '+82',
        flag: '🇰🇷',
        flagImage: 'assets/images/flags/kr.png',
        nativeName: '+82'
    },
    {
        name: 'South Sudan',
        code: 'SS',
        dialCode: '+211',
        flag: '🇸🇸',
        flagImage: 'assets/images/flags/ss.png',
        nativeName: '+211'
    },
    {
        name: 'Spain',
        code: 'ES',
        dialCode: '+34',
        flag: '🇪🇸',
        flagImage: 'assets/images/flags/es.png',
        nativeName: '+34'
    },
    {
        name: 'Sri Lanka',
        code: 'LK',
        dialCode: '+94',
        flag: '🇱🇰',
        flagImage: 'assets/images/flags/lk.png',
        nativeName: '+94'
    },
    {
        name: 'Sudan',
        code: 'SD',
        dialCode: '+249',
        flag: '🇸🇩',
        flagImage: 'assets/images/flags/sd.png',
        nativeName: '+249'
    },
    {
        name: 'Suriname',
        code: 'SR',
        dialCode: '+597',
        flag: '🇸🇷',
        flagImage: 'assets/images/flags/sr.png',
        nativeName: '+597'
    },
    {
        name: 'Svalbard and Jan Mayen',
        code: 'SJ',
        dialCode: '+47',
        flag: '🇸🇯',
        flagImage: 'assets/images/flags/sj.png',
        nativeName: '+47'
    },
    {
        name: 'Swaziland',
        code: 'SZ',
        dialCode: '+268',
        flag: '🇸🇿',
        flagImage: 'assets/images/flags/sz.png',
        nativeName: '+268'
    },
    {
        name: 'Sweden',
        code: 'SE',
        dialCode: '+46',
        flag: '🇸🇪',
        flagImage: 'assets/images/flags/se.png',
        nativeName: '+46'
    },
    {
        name: 'Switzerland',
        code: 'CH',
        dialCode: '+41',
        flag: '🇨🇭',
        flagImage: 'assets/images/flags/ch.png',
        nativeName: '+41'
    },
    {
        name: 'Syria',
        code: 'SY',
        dialCode: '+963',
        flag: '🇸🇾',
        flagImage: 'assets/images/flags/sy.png',
        nativeName: '+963'
    },
    // T
    {
        name: 'Taiwan',
        code: 'TW',
        dialCode: '+886',
        flag: '🇹🇼',
        flagImage: 'assets/images/flags/tw.png',
        nativeName: '+886'
    },
    {
        name: 'Tajikistan',
        code: 'TJ',
        dialCode: '+992',
        flag: '🇹🇯',
        flagImage: 'assets/images/flags/tj.png',
        nativeName: '+992'
    },
    {
        name: 'Tanzania',
        code: 'TZ',
        dialCode: '+255',
        flag: '🇹🇿',
        flagImage: 'assets/images/flags/tz.png',
        nativeName: '+255'
    },
    {
        name: 'Thailand',
        code: 'TH',
        dialCode: '+66',
        flag: '🇹🇭',
        flagImage: 'assets/images/flags/th.png',
        nativeName: '+66'
    },
    {
        name: 'Timor-Leste',
        code: 'TL',
        dialCode: '+670',
        flag: '🇹🇱',
        flagImage: 'assets/images/flags/tl.png',
        nativeName: '+670'
    },
    {
        name: 'Togo',
        code: 'TG',
        dialCode: '+228',
        flag: '🇹🇬',
        flagImage: 'assets/images/flags/tg.png',
        nativeName: '+228'
    },
    {
        name: 'Tokelau',
        code: 'TK',
        dialCode: '+690',
        flag: '🇹🇰',
        flagImage: 'assets/images/flags/tk.png',
        nativeName: '+690'
    },
    {
        name: 'Tonga',
        code: 'TO',
        dialCode: '+676',
        flag: '🇹🇴',
        flagImage: 'assets/images/flags/to.png',
        nativeName: '+676'
    },
    {
        name: 'Trinidad and Tobago',
        code: 'TT',
        dialCode: '+1868',
        flag: '🇹🇹',
        flagImage: 'assets/images/flags/tt.png',
        nativeName: '+1868'
    },
    {
        name: 'Tunisia',
        code: 'TN',
        dialCode: '+216',
        flag: '🇹🇳',
        flagImage: 'assets/images/flags/tn.png',
        nativeName: '+216'
    },
    {
        name: 'Turkey',
        code: 'TR',
        dialCode: '+90',
        flag: '🇹🇷',
        flagImage: 'assets/images/flags/tr.png',
        nativeName: '+90'
    },
    {
        name: 'Turkmenistan',
        code: 'TM',
        dialCode: '+993',
        flag: '🇹🇲',
        flagImage: 'assets/images/flags/tm.png',
        nativeName: '+993'
    },
    {
        name: 'Turks and Caicos Islands',
        code: 'TC',
        dialCode: '+1649',
        flag: '🇹🇨',
        flagImage: 'assets/images/flags/tc.png',
        nativeName: '+1649'
    },
    {
        name: 'Tuvalu',
        code: 'TV',
        dialCode: '+688',
        flag: '🇹🇻',
        flagImage: 'assets/images/flags/tv.png',
        nativeName: '+688'
    },
    // U
    {
        name: 'Uganda',
        code: 'UG',
        dialCode: '+256',
        flag: '🇺🇬',
        flagImage: 'assets/images/flags/ug.png',
        nativeName: '+256'
    },
    {
        name: 'Ukraine',
        code: 'UA',
        dialCode: '+380',
        flag: '🇺🇦',
        flagImage: 'assets/images/flags/ua.png',
        nativeName: '+380'
    },
    {
        name: 'United Arab Emirates',
        code: 'AE',
        dialCode: '+971',
        flag: '🇦🇪',
        flagImage: 'assets/images/flags/ae.png',
        nativeName: '+971'
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
        nativeName: '+598'
    },
    {
        name: 'US Virgin Islands',
        code: 'VI',
        dialCode: '+1340',
        flag: '🇻🇮',
        flagImage: 'assets/images/flags/vi.png',
        nativeName: '+1340'
    },
    {
        name: 'Uzbekistan',
        code: 'UZ',
        dialCode: '+998',
        flag: '🇺🇿',
        flagImage: 'assets/images/flags/uz.png',
        nativeName: '+998'
    },
    // V
    {
        name: 'Vanuatu',
        code: 'VU',
        dialCode: '+678',
        flag: '🇻🇺',
        flagImage: 'assets/images/flags/vu.png',
        nativeName: '+678'
    },
    {
        name: 'Vatican City',
        code: 'VA',
        dialCode: '+39',
        flag: '🇻🇦',
        flagImage: 'assets/images/flags/va.png',
        nativeName: '+39'
    },
    {
        name: 'Venezuela',
        code: 'VE',
        dialCode: '+58',
        flag: '🇻🇪',
        flagImage: 'assets/images/flags/ve.png',
        nativeName: '+58'
    },
    {
        name: 'Vietnam',
        code: 'VN',
        dialCode: '+84',
        flag: '🇻🇳',
        flagImage: 'assets/images/flags/vn.png',
        nativeName: '+84'
    },
    // W
    {
        name: 'Wallis and Futuna',
        code: 'WF',
        dialCode: '+681',
        flag: '🇼🇫',
        flagImage: 'assets/images/flags/wf.png',
        nativeName: '+681'
    },
    {
        name: 'Western Sahara',
        code: 'EH',
        dialCode: '+212',
        flag: '🇪🇭',
        flagImage: 'assets/images/flags/eh.png',
        nativeName: '+212'
    },
    // Y
    {
        name: 'Yemen',
        code: 'YE',
        dialCode: '+967',
        flag: '🇾🇪',
        flagImage: 'assets/images/flags/ye.png',
        nativeName: '+967'
    },
    // Z
    {
        name: 'Zambia',
        code: 'ZM',
        dialCode: '+260',
        flag: '🇿🇲',
        flagImage: 'assets/images/flags/zm.png',
        nativeName: '+260'
    },
    {
        name: 'Zimbabwe',
        code: 'ZW',
        dialCode: '+263',
        flag: '🇿🇼',
        flagImage: 'assets/images/flags/zw.png',
        nativeName: '+263'
    }
];
