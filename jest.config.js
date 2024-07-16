export const roots = ["<rootDir>"];
export const transform = {
  "^.+\\.ts?$": "ts-jest",
};
export const testRegex = "(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$";
export const moduleFileExtensions = ["ts", "js", "json", "node"];
export const collectCoverage = true;
export const clearMocks = true;
export const coverageDirectory = "coverage";
export const testTimeout = 10000;
