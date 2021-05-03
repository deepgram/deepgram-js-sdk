import { request } from "https";
import { ApiKeyResponse, Key } from "./types";

export class Keys {
  private _path = "/v2/keys";

  constructor(private credentials: string, private apiUrl: string) {}

  async list(): Promise<ApiKeyResponse> {
    const requestOptions = {
      host: this.apiUrl,
      path: this._path,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${this.credentials}`,
      },
    };

    return new Promise((resolve, reject) => {
      try {
        const httpRequest = request(requestOptions, (dgRes) => {
          let dgResContent = "";

          dgRes.on("data", (chunk) => {
            dgResContent += chunk;
          });

          dgRes.on("end", () => {
            const dgResJson = JSON.parse(dgResContent);
            if (dgResJson.error) {
              reject(`DG: ${dgResContent}`);
            }
            resolve(dgResJson);
          });

          dgRes.on("error", (err) => {
            reject(`DG: ${err}`);
          });
        });

        httpRequest.on("error", (err) => {
          reject(`DG: ${err}`);
        });

        httpRequest.end();
      } catch (err) {
        reject(err);
      }
    });
  }

  async create(label: string): Promise<Key> {
    const requestOptions = {
      host: this.apiUrl,
      path: this._path,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${this.credentials}`,
      },
    };

    return new Promise((resolve, reject) => {
      try {
        const httpRequest = request(requestOptions, (dgRes) => {
          let dgResContent = "";

          dgRes.on("data", (chunk) => {
            dgResContent += chunk;
          });

          dgRes.on("end", () => {
            const dgResJson = JSON.parse(dgResContent);
            if (dgResJson.error) {
              reject(`DG: ${dgResContent}`);
            }
            resolve(dgResJson);
          });

          dgRes.on("error", (err) => {
            reject(`DG: ${err}`);
          });
        });

        httpRequest.on("error", (err) => {
          reject(`DG: ${err}`);
        });
        const payload = JSON.stringify({ label });

        httpRequest.write(payload);
        httpRequest.end();
      } catch (err) {
        reject(err);
      }
    });
  }

  async delete(key: string): Promise<void> {
    const requestOptions = {
      host: this.apiUrl,
      path: `${this._path}/${key}`,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${this.credentials}`,
      },
    };

    return new Promise((resolve, reject) => {
      try {
        const httpRequest = request(requestOptions, (dgRes) => {
          let dgResContent = "";

          dgRes.on("data", (chunk) => {
            dgResContent += chunk;
          });

          dgRes.on("end", () => {
            const dgResJson = JSON.parse(dgResContent);
            if (dgResJson.error) {
              reject(`DG: ${dgResContent}`);
            }
            resolve(dgResJson);
          });

          dgRes.on("error", (err) => {
            reject(`DG: ${err}`);
          });
        });

        httpRequest.on("error", (err) => {
          reject(`DG: ${err}`);
        });
        const payload = JSON.stringify({ key });

        httpRequest.write(payload);
        httpRequest.end();
      } catch (err) {
        reject(err);
      }
    });
  }
}
