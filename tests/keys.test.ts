// import chai from "chai";

// import { Keys } from "../src/keys";

// chai.should();

// describe("Key tests", () => {
//   it("Providing buffer without mimetype will return error", (done) => {
//     transcribe("testKey:testSecret", "fakeUrl", Buffer.allocUnsafe(100)).catch(
//       (e) => {
//         try {
//           e.message.should.eq(
//             "DG: Mimetype must be provided if the source is a Buffer"
//           );
//         } catch (assertionError) {
//           done(assertionError);
//           return;
//         }
//       }
//     );
//     done();
//   });
// });
