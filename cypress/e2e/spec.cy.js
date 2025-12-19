describe('Test login as Guest', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173/');
    cy.get('.menu-item > span').click();
    cy.get('.guests > .button').click();
  })
})

describe('Login as Guest and create a new test group', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173/');
    cy.get('.menu-item > span').click();
    cy.get('.guests > .button').click();
    cy.get('.dropdown-trigger-button > span').click();
    cy.get('.expanded > ul > :nth-child(1) > a').click();
    cy.get('#ds-new-title').type('My Testgroup');
    cy.get('[style=""] > .modal-outer > .modal-inner > [data-v-1ff9814c=""] > .buttons > :nth-child(2)').click();
  })
})

describe('Login as Guest and create a new dataset in "Sonstiges" group', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173/');
    cy.get('.menu-item > span').click();
    cy.get('.guests > .button').click();
    cy.get('.dropdown-trigger-button > span').click();
    cy.get('.expanded > ul > :nth-child(2) > a').click();
    cy.get('#ds-new-type').select('Rechnung');
    cy.get('#ds-new-title').type('My Testdataset');
    cy.get('#ds-new-group').select('Sonstiges');
    cy.get('[data-test="dp-input"]').click();
    cy.get('[data-test="Thu Jan 01 2026 00:00:00 GMT+0100 (Mitteleuropäische Normalzeit)"] > .dp__cell_inner').click();
    cy.get('#ds-new-interval').select('Jahr');
    cy.get(':nth-child(3) > .w-full').type('1500');
    cy.get('.modal-inner > [data-v-1ff9814c=""] > .buttons > :nth-child(2)').click();
  })
})