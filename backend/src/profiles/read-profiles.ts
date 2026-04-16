import { profileInfo } from "./fuzzing-routes.ts";
import { profileInfoPortScanner } from "./port-scanner.ts";
import { profileInfoHeadersScanner } from "./headers-scanner.ts";

export const readProfiles = () => {
    const profiles = [
        profileInfo(),
        profileInfoPortScanner(),
        profileInfoHeadersScanner()
    ];

    return profiles;
}
