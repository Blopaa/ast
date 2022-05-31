export default {
  clearMocks: true,
  roots: ["<rootDir>/src/tests"],
  modulePathIgnorePatterns: ["<rootDir>/src/tests/utils"],
  testEnvironment: "node",
  preset: "ts-jest",
};
