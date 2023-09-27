import { ListOnPremCredentialsResponse } from "../../src/lib/types";
import onpremCredential from "./onpremCredential";

const onpremCredentials: ListOnPremCredentialsResponse = {
  distribution_credentials: [onpremCredential],
};

export default onpremCredentials;
