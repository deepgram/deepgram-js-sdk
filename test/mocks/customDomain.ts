import { faker } from "@faker-js/faker";

const customDomain: string = `api.${faker.internet.domainName()}`;

export default customDomain;
