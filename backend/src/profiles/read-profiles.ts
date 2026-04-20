import { profileInfo } from "./fuzzing-routes";
import { profileInfoPortScanner } from "./port-scanner";
import { profileInfoHeadersScanner } from "./headers-scanner";

export const readProfiles = () => {
    const profiles = [
        profileInfo(),
        profileInfoPortScanner(),
        profileInfoHeadersScanner()
    ];

    return profiles;
}
