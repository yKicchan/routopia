/**
 * Rules for commit message conventions
 * Docs: https://commitlint.js.org/#/reference-rules
 */
module.exports = {
  // See: https://github.com/conventional-changelog/commitlint/blob/master/@commitlint/config-conventional/README.md
  extends: ["@commitlint/config-conventional"],
  rules: {
    /**
     * Rules for the commit type prefix
     */
    // The type prefix is required
    "type-empty": [2, "never"],
    // The type prefix must be in lowercase
    "type-case": [2, "always", "lower-case"],
    // Enforce specific type prefixes
    // Reference: https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit
    "type-enum": [
      2,
      "always",
      [
        // Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
        "build",
        // Changes to CI configuration files and scripts (examples: GitHub Actions, SauceLabs)
        "ci",
        // Documentation-only changes
        "docs",
        // Introduction of a new feature
        "feat",
        // A bug fix
        "fix",
        // Code changes that improve performance
        "perf",
        // Code changes that neither fix a bug nor add a feature
        "refactor",
        // Changes that do not affect code meaning (white-space, formatting, missing semi-colons, etc.)
        "style",
        // Adding new tests or updating existing ones
        "test",
        // Used for version releases
        "release",
        // Revert a previous commit
        "revert",
        // Miscellaneous tasks that do not fit into the categories above
        "chore",
      ],
    ],

    /**
     * Rules for the commit subject
     */
    // The subject is required
    "subject-empty": [2, "never"],
    // Allow any casing for the subject
    "subject-case": [0, "never"],
    // The subject must not end with a period
    "subject-full-stop": [2, "never", "."],

    /**
     * General rules
     */
    // The first line (header) must be no more than 100 characters
    "header-max-length": [2, "always", 100],
    // The second line (body) must be blank
    "body-leading-blank": [2, "always"],
    "footer-leading-blank": [2, "always"],
    // No character limit for lines after the second line
    "body-max-line-length": [0, "always"],
    "footer-max-line-length": [0, "always"],
  },
};
