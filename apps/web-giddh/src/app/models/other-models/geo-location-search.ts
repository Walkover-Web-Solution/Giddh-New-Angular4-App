/**
 * GeoLocationSearch interface definition
 * Defines the structure and contract for GeoLocationSearch objects
 */
export interface GeoLocationSearch {
    QueryString: string;
    AdministratorLevel: string;
    Country: string;
    OnlyCity: boolean;
}
