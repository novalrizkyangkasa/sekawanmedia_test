import { faker } from "@faker-js/faker/locale/id_ID";

describe("Automation Test", () => {
  beforeEach(() => {
    Cypress.session.clearAllSavedSessions();
    cy.clearCookie("ci_session_dev");
    cy.wait(3000);

    cy.visit("https://aps-rejanglebong.skwn.dev/dev");

    cy.on("uncaught:exception", (e) => {
      if (
        e.message.includes(
          "Cannot read properties of null (reading 'classList')"
        )
      ) {
        return false;
      }
    });

    cy.get("[id=login_form]")
      .find("h3.font-weight-bolder.text-dark")
      .should("have.text", "Login APS");

    cy.get("[id=username]")
      .type("candidat", { delay: 50 })
      .should("have.value", "candidat")
      .then(($input) => {
        const inputValue = $input.val();
        cy.wrap(inputValue).as("inputValue");
      });

    cy.wait(1000);

    cy.get("[id=password]")
      .type("password123", { delay: 50 })
      .should("have.value", "password123");

    cy.get("[id=kt_login_signin_submit]").click();
  });

  //verify on homepage
  it("Verify on homepage", () => {
    cy.intercept(
      "POST",
      "https://aps-rejanglebong.skwn.dev/dev/index.php/main/getName"
    ).as("getUser");

    cy.wait("@getUser").then((interception) => {
      const responseData = interception.response.body;
      cy.wrap(responseData).as("responseData");
    });

    cy.wait(5000);

    const today = require("dayjs");
    const todaysDate = today().format("DD MM YYYY");

    cy.get(".align-items-center > div.text-center .font-weight-bolder")
      .should("be.visible")
      .invoke("text")
      .then((text) => {
        const [hari, tanggal, bulan, tahun] = text.split(" ");
        const angkaBulan =
          new Date(Date.parse(bulan + " 1, " + tahun)).getMonth() + 1;
        const teksHasil = `${tanggal.padStart(2, "0")} ${angkaBulan
          .toString()
          .padStart(2, "0")} ${tahun}`;
        expect(teksHasil).to.contain(todaysDate);
      });

    cy.wait(3000);

    cy.get("@responseData").then((responseData) => {
      cy.get("[id=nama_display]").should("have.text", responseData.user_nama);
    });

    cy.get("[id=kt_quick_user_toggle]").click();

    cy.wait(3000);

    cy.get("@responseData").then((responseData) => {
      cy.get("[id=username_display]").should(
        "have.text",
        responseData.user_username
      );
    });

    cy.wait(3000);

    cy.get("@responseData").then((responseData) => {
      cy.get("[id=nama_profile]").should("have.text", responseData.user_nama);
    });

    cy.wait(3000);

    cy.get("[id=kt_quick_user_close").click();

    cy.wait(3000);

    cy.get("@inputValue").then((inputValue) => {
      cy.get("[id=username_display]").should("have.text", inputValue);
    });

    cy.wait(3000);

    cy.get("[id=kt_quick_user_toggle]")
      .click()
      .then(() => {
        cy.get(".btn-light-danger").click();
        cy.wait(1000);
      });
  });

  //add data
  it("Add New Data Pemilih", () => {
    const number = faker.random.numeric(16);
    const rtrw = faker.datatype.number({ min: 1, max: 20 });
    const fullname = faker.name.fullName();
    const address = faker.address.streetAddress(true);
    const city = faker.address.cityName();

    function formatdate(number) {
      return String(number).padStart(2, "0");
    }

    const birthdate = faker.date.birthdate({ min: 18, max: 65, mode: "age" });
    const year = birthdate.getFullYear();
    const month = formatdate(birthdate.getMonth() + 1);
    const day = formatdate(birthdate.getDate());
    const tggl = `${day}${month}${year}`;

    cy.get("[id=kt_aside_menu]")
      .find("[data-con=73a816cef9284ef40d99db46264049bd]")
      .click();

    cy.get("[id=cardDataPemilih]")
      .find(".btn-group")
      .find(".btn.btn-aps.font-weight-bolder.btn-sm")
      .click();

    cy.get("[id=pemilih_kk]")
      .should("be.visible")
      .type(number, { delay: 50 })
      .then(() => {
        cy.get("[id=pemilih_kk]").should("have.value", number);
      });

    cy.wait(1000);

    cy.get("[id=pemilih_nik]")
      .should("be.visible")
      .type(number, { delay: 50 })
      .then(() => {
        cy.get("[id=pemilih_nik]").should("have.value", number);
      });

    cy.wait(1000);

    cy.get("[id=pemilih_nama]")
      .should("be.visible")
      .type(fullname, { delay: 50 })
      .then(() => {
        cy.get("[id=pemilih_nama]").should("have.value", fullname);
      });

    cy.wait(1000);

    cy.get("[id=pemilih_alamat]")
      .should("be.visible")
      .type(address, { delay: 50 })
      .then(() => {
        cy.get("[id=pemilih_alamat]").should("have.value", address);
      });

    cy.wait(1000);

    cy.get("[id=pemilih_rt]")
      .should("be.visible")
      .type(rtrw, { delay: 50 })
      .then(() => {
        cy.get("[id=pemilih_rt]").should("have.value", rtrw);
      });

    cy.wait(1000);

    cy.get("[id=pemilih_rw]")
      .should("be.visible")
      .type(rtrw, { delay: 50 })
      .then(() => {
        cy.get("[id=pemilih_rw]").should("have.value", rtrw);
      });

    cy.wait(1000);

    cy.get("[id=select2-pemilih_kelurahan_id-container]")
      .should("be.visible")
      .click()
      .then(() => {
        cy.get("[id=select2-pemilih_kelurahan_id-results]")
          .find("li.select2-results__option")
          .should("have.length.greaterThan", 0)
          .its("length")
          .then(cy.log)
          .then((length) => {
            const k = 47;
            cy.get("[id=select2-pemilih_kelurahan_id-results]")
              .find("li.select2-results__option")
              .eq(k)
              .click();
          });
      });

    cy.wait(1000);

    cy.get("[id=pemilih_tempat_lahir]")
      .should("be.visible")
      .type(city, { delay: 50 })
      .then(() => {
        cy.get("[id=pemilih_tempat_lahir]").should("have.value", city);
      });

    cy.wait(1000);

    cy.get("[id=pemilih_tgl_lahir]")
      .should("be.visible")
      .type(tggl, { delay: 50 })
      .then(cy.log)
      .then(() => {
        cy.get("[id=pemilih_tgl_lahir]").should("have.value", tggl);
      });

    cy.wait(1000);

    cy.get(".col-8 > .radio-inline > .radio")
      .should("be.visible")
      .find('input[type="radio"][value="L"]')
      .check({ force: true })
      .should("be.checked");

    cy.wait(1000);

    cy.get("[id=select2-pemilih_status_kawin-container]")
      .should("be.visible")
      .click()
      .then(() => {
        cy.get("[id=select2-pemilih_status_kawin-results]")
          .find("li.select2-results__option")
          .should("have.length.greaterThan", 0)
          .its("length")
          .then(cy.log)
          .then((length) => {
            const k = Cypress._.random(0, 3);
            const l = length - k;
            cy.log(l);
            cy.get("[id=select2-pemilih_status_kawin-results]")
              .find("li.select2-results__option")
              .eq(l)
              .click();
          });
      });

    cy.wait(1000);

    cy.get("[aria-labelledby=select2-pemilih_caleg_id-container]")
      .should("be.visible")
      .click()
      .then(() => {
        cy.get("[id=select2-pemilih_caleg_id-results]")
          .find("li.select2-results__option")
          .should("have.length.greaterThan", 0)
          .its("length")
          .then(cy.log)
          .then((length) => {
            const k = Cypress._.random(0, 1);
            const l = length - k;
            cy.log(l);
            cy.get("[id=select2-pemilih_caleg_id-results]")
              .find("li.select2-results__option")
              .eq(l)
              .click();
          });
      });

    cy.wait(1000);

    cy.get("[aria-labelledby=select2-pemilih_tps_id-container]")
      .should("be.visible")
      .click()
      .then(() => {
        cy.get("[id=select2-pemilih_tps_id-results]")
          .find("li.select2-results__option")
          .should("have.length.greaterThan", 0)
          .its("length")
          .then(cy.log)
          .then((length) => {
            const k = 0;
            cy.get("[id=select2-pemilih_tps_id-results]")
              .find("li.select2-results__option")
              .eq(k)
              .click();
          });
      });

    cy.wait(1000);

    cy.get(".col-lg-8 > .col-form-label")
      .should("be.visible")
      .find('input[type="radio"][value="dd07344b3bf31c95c6e5019dbe477ccc"]')
      .check({ force: true })
      .should("be.checked");

    cy.get("[id=btn-simpan]")
      .should("be.visible")
      .click()
      .then(() => {
        cy.intercept(
          "POST",
          "https://aps-rejanglebong.skwn.dev/dev/index.php/inputpemilih/",
          (req) => {
            expect(req.body).to.not.be.empty;
          }
        ).as("inputpemilih");
        cy.wait("@inputPemilih").then((interception) => {
          expect(interception.response.statusCode).to.equal(200);
        });
      });

    cy.wait(3000);

    cy.get("[id=kt_quick_user_toggle]")
      .click()
      .then(() => {
        cy.get(".btn-light-danger").click();
        cy.wait(1000);
      });
  });

  //search user
  it("Search User", () => {
    cy.get("[id=kt_aside_menu]")
      .find("[data-con=73a816cef9284ef40d99db46264049bd]")
      .click();

    cy.get("[id=table-inputpemilih_dtSearch]")
      .type("botuna", { delay: 50 })
      .should("have.value", "botuna")
      .then(($input) => {
        const searchuser = $input.val(); // Mengambil nilai (value) dari elemen input
        cy.wrap(searchuser).as("searchuser"); // Menyimpan nilai (value) dalam sebuah alias
      });

    cy.get("@searchuser").then((searchuser) => {
      cy.get("[id=table-inputpemilih_wrapper] tbody tr")
        .find("td.align-top", { timeout: 15000 })
        .eq(2)
        .should("be.visible")
        .and("have.text", searchuser);
    });

    cy.wait(3000);

    cy.get("[id=kt_quick_user_toggle]")
      .click()
      .then(() => {
        cy.get(".btn-light-danger").click();
        cy.wait(1000);
      });
  });

  //filter user
  it("Filter Data", () => {
    cy.get("[id=kt_aside_menu]")
      .find("[data-con=73a816cef9284ef40d99db46264049bd]")
      .click();

    cy.get(".input-group-append > .btn").click();

    cy.get("[id=select2-filter_provinsi_id-container]")
      .click()
      .then(() => {
        cy.get("[id=select2-filter_provinsi_id-results]")
          .find("li.select2-results__option")
          .should("have.length.greaterThan", 0)
          .eq(3)
          .click();
      });

    cy.wait(1000);

    cy.get("[id=select2-filter_kota_id-container]")
      .click()
      .then(() => {
        cy.get("[id=select2-filter_kota_id-results]")
          .find("li.select2-results__option")
          .should("be.visible")
          .and("not.be.empty")
          .eq(0)
          .click();
      });

    cy.wait(1000);

    cy.get("[id=select2-filter_kecamatan_id-container]")
      .click()
      .then(() => {
        cy.get("[id=select2-filter_kecamatan_id-results]")
          .find("li.select2-results__option")
          .should("be.visible")
          .and("not.be.empty")
          .eq(3)
          .click();
      });

    cy.wait(1000);

    cy.get("[id=select2-filter_kelurahan_id-container]")
      .click()
      .then(() => {
        cy.get("[id=select2-filter_kelurahan_id-results]")
          .find("li.select2-results__option")
          .should("be.visible")
          .and("not.be.empty")
          .eq(2)
          .click();
      });

    cy.wait(1000);

    cy.get("[id=select2-filter_tps_id-container]")
      .click()
      .then(() => {
        cy.get("[id=select2-filter_tps_id-results]")
          .find("li.select2-results__option")
          .should("be.visible")
          .and("not.be.empty")
          .eq(2)
          .click();
      });

    cy.wait(1000);

    cy.intercept(
      "POST",
      "https://aps-rejanglebong.skwn.dev/dev/index.php/inputpemilih"
    ).as("filteruser");

    cy.get(
      "#table-inputpemilih_id-modal > .modal-dialog > .modal-content > form > .modal-footer > .btn-aps"
    ).click();

    cy.wait("@filteruser").then((interception) => {
      const responseData = interception.response.body;
      const totalpemilih = responseData.recordsTotal;
      const namakecamatan = responseData.chart_rekap.data[0].kecamatan;
      const jumlahpotensi = responseData.chart_rekap.data[0].POTENSI;
      const jumlahpemilih = responseData.chart_rekap.data[0].PEMILIH;

      cy.wrap(totalpemilih).as("jumlah");
      cy.wrap(namakecamatan).as("kecamatan");
      cy.wrap(jumlahpotensi).as("potensi");
      cy.wrap(jumlahpemilih).as("pemilih");
    });

    cy.wait(5000);

    cy.get("@kecamatan").then((kecamatan) => {
      cy.get("[id=tableRekapPemilih] table tbody tr")
        .find(":nth-child(1)")
        .should("be.visible")
        .invoke("text")
        .then((text) => {
          const namakecamatan2 = text.trim();
          cy.wrap(namakecamatan2).as("name");
        })
        .then(() => {
          cy.get("@name").then((name) => {
            expect(name).to.eq(kecamatan);
          });
        });
    });

    cy.wait(1000);

    cy.get("@potensi").then((potensi) => {
      cy.get("[id=tableRekapPemilih] table tbody tr")
        .find(":nth-child(2)")
        .should("be.visible")
        .invoke("text")
        .then((text) => {
          const jumlahpotensi2 = text.trim();
          cy.wrap(jumlahpotensi2).as("potensi2");
        })
        .then(() => {
          cy.get("@potensi2").then((potensi2) => {
            expect(parseInt(potensi2)).to.eq(parseInt(potensi));
          });
        });
    });

    cy.wait(1000);

    cy.get("@pemilih").then((pemilih) => {
      cy.get("[id=tableRekapPemilih] table tbody tr")
        .find(":nth-child(3)")
        .should("be.visible")
        .invoke("text")
        .then((text) => {
          const jumlahpemilih2 = text.trim();
          cy.wrap(jumlahpemilih2).as("pemilih2");
        })
        .then(() => {
          cy.get("@pemilih2").then((pemilih2) => {
            expect(parseInt(pemilih2)).to.eq(parseInt(pemilih));
          });
        });
    });

    cy.wait(1000);

    cy.get("@jumlah").then((jumlah) => {
      cy.get("[id=tableRekapPemilih] table tbody tr")
        .find(":nth-child(4)")
        .should("be.visible")
        .invoke("text")
        .then((text) => {
          const totalpemilih2 = text.trim();
          cy.wrap(totalpemilih2).as("total");
        })
        .then(() => {
          cy.get("@total").then((total) => {
            expect(parseInt(total)).to.eq(parseInt(jumlah));
          });
        });
    });

    cy.wait(3000);

    cy.get("[id=kt_quick_user_toggle]")
      .click()
      .then(() => {
        cy.get(".btn-light-danger").click();
        cy.wait(1000);
      });
  });

  //perubahan data
  it("Edit Data", () => {
    const number = faker.random.numeric(16);
    const rtrw = faker.datatype.number({ min: 1, max: 20 });
    const fullname = faker.name.fullName();
    const address = faker.address.streetAddress(true);
    const city = faker.address.cityName();

    function formatdate(number) {
      return String(number).padStart(2, "0");
    }

    const birthdate = faker.date.birthdate({ min: 18, max: 65, mode: "age" });
    const year = birthdate.getFullYear();
    const month = formatdate(birthdate.getMonth() + 1);
    const day = formatdate(birthdate.getDate());

    const tggl = `${day}${month}${year}`;

    cy.get("[id=kt_aside_menu]")
      .find("[data-con=73a816cef9284ef40d99db46264049bd]")
      .click();

    cy.get("[id=table-inputpemilih_dtSearch]")
      .type("botuna", { delay: 50 })
      .should("be.visible")
      .and("have.value", "botuna")
      .then(($input) => {
        const searchuser = $input.val(); // Mengambil nilai (value) dari elemen input
        cy.wrap(searchuser).as("searchuser"); // Menyimpan nilai (value) dalam sebuah alias
      });

    cy.get("@searchuser").then((searchuser) => {
      cy.get("[id=table-inputpemilih_wrapper] tbody tr")
        .find("td.align-top", { timeout: 15000 })
        .eq(2)
        .should("be.visible")
        .and("have.text", searchuser);
    });

    cy.intercept(
      "POST",
      "https://aps-rejanglebong.skwn.dev/dev/index.php/inputpemilih/edit"
    ).as("getUser");

    cy.get("[id=table-inputpemilih_wrapper]")
      .find(".btn-icon-warning")
      .should("be.visible")
      .click({ multiple: true, force: true });

    cy.wait("@getUser").then((interception) => {
      const responseData = interception.response.body;
      cy.wrap(responseData).as("responseData");
    });

    cy.wait(5000);

    cy.get("@responseData").then((responseData) => {
      cy.get("#table-inputpemilih > tbody > tr > td:nth-child(3)", {
        timeout: 15000,
      }).should("contain.text", responseData.pemilih_nama);
    });

    cy.get("[id=pemilih_kk]")
      .clear()
      .should("be.visible")
      .wait(1000)
      .type(number, { delay: 50 })
      .then(() => {
        cy.get("[id=pemilih_kk]").should("have.value", number);
      });

    cy.wait(1000);

    cy.get("[id=pemilih_nik]")
      .clear()
      .should("be.visible")
      .wait(1000)
      .type(number, { delay: 50 })
      .then(() => {
        cy.get("[id=pemilih_nik]").should("have.value", number);
      });

    cy.wait(1000);

    cy.get("[id=pemilih_nama]")
      .clear()
      .should("be.visible")
      .wait(1000)
      .type(fullname, { delay: 50 })
      .then(() => {
        cy.get("[id=pemilih_nama]").should("have.value", fullname);
      });

    cy.wait(1000);

    cy.get("[id=pemilih_alamat]")
      .clear()
      .should("be.visible")
      .wait(1000)
      .type(address, { delay: 50 })
      .then(() => {
        cy.get("[id=pemilih_alamat]").should("have.value", address);
      });

    cy.wait(1000);

    cy.get("[id=pemilih_rt]")
      .clear()
      .should("be.visible")
      .wait(1000)
      .type(rtrw, { delay: 50 })
      .then(() => {
        cy.get("[id=pemilih_rt]").should("have.value", rtrw);
      });

    cy.wait(1000);

    cy.get("[id=pemilih_rw]")
      .clear()
      .should("be.visible")
      .wait(1000)
      .type(rtrw, { delay: 50 })
      .then(() => {
        cy.get("[id=pemilih_rw]").should("have.value", rtrw);
      });

    cy.wait(1000);

    cy.get("[id=pemilih_tempat_lahir]")
      .clear()
      .should("be.visible")
      .wait(1000)
      .type(city, { delay: 50 })
      .then(() => {
        cy.get("[id=pemilih_tempat_lahir]").should("have.value", city);
      });

    cy.get("[id=btn-simpan]")
      .should("be.visible")
      .click()
      .then(() => {
        cy.intercept(
          "POST",
          "https://aps-rejanglebong.skwn.dev/dev/index.php/inputpemilih/",
          (req) => {
            expect(req.body).to.not.be.empty;
          }
        ).as("inputpemilih");
        cy.wait("@inputPemilih").then((interception) => {
          expect(interception.response.statusCode).to.equal(200);
        });
      });

    cy.wait(3000);

    cy.get("[id=kt_quick_user_toggle]")
      .click()
      .then(() => {
        cy.get(".btn-light-danger").click();
        cy.wait(1000);
      });
  });

  //import data
  it("Import Data", () => {
    cy.get("[id=kt_aside_menu]")
      .find("[data-con=73a816cef9284ef40d99db46264049bd]")
      .click();

    cy.get("[id=cardDataPemilih]")
      .find(".btn-group")
      .find(".btn.btn-sm.btn-aps.dropdown-toggle.dropdown-toggle-split")
      .click()
      .then(() => {
        cy.wait(2000);
        cy.get('[onclick="modalExcel(this)"]').should("be.visible").click();
      });

    cy.wait(2000);

    cy.fixture("datapemilih.xlsx", { encoding: null }).as("datapemilih");
    cy.get("input[type=file]")
      .selectFile("@datapemilih")
      .should("be.visible")
      .then(() => {
        cy.wait(2000);

        cy.intercept(
          "POST",
          "https://aps-rejanglebong.skwn.dev/dev/index.php/inputpemilih/importExcel"
        ).as("uploadfile");

        cy.get("#form_upload_pemilih > .modal-footer > .btn-aps")
          .should("be.visible")
          .click()
          .wait(3000)
          .then(() => {
            cy.get(".swal2-confirm.btn").should("be.visible").click();
            cy.wait(5000);

            cy.wait("@uploadfile").then((interception) => {
              expect(interception.response.statusCode).to.equal(200),
                expect(interception.response.body.success).eq(true),
                expect(interception.response.body).to.not.be.empty;

              cy.wait(3000);

              cy.get("[id=swal2-title]")
                .should("be.visible")
                .and("have.text", "Success");

              cy.wait(3000);

              cy.get(".swal2-confirm").should("be.visible").click();

              cy.wait(3000);
            });
          });
      });

    cy.wait(3000);

    cy.get("[id=kt_quick_user_toggle]")
      .click()
      .then(() => {
        cy.get(".btn-light-danger").click();
        cy.wait(1000);
      });
  });
});
