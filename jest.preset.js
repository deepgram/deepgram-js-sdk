/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports */

const { getJestProjects } = require("@nx/jest");

module.exports = {
  projects: getJestProjects(),
};
