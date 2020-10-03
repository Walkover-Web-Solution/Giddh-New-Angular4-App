class LedgerPage {

    clickAccount(){
        return cy.xpath('//div[@class=\'ng-star-inserted\']//input[@placeholder=\'To Select Accounts\']')
    }

    inputAccount(){
        return cy.xpath('//input[@placeholder=\'To Select Accounts\']')
    }

    selectSalesAccount(){
        return cy.get('.hilighted > .list-item > .item')
    }

    selectSalesWithInventory(){
        return cy.get(':nth-child(2) > .list-item > .item')
    }

    enterAmount(){
       // cy.xpath('//td[@class=\'col-xs-4 col-md-3 col-lg-3 pos-rel\']//input[@class=\'form-control alR ng-untouched ng-valid ng-dirtyl\']').click()
        return cy.xpath('//input[@name=\'totalAmount\']')
    }

    saveButton(){
        return cy.xpath('//span[@class=\'ladda-label\']')
    }



}

export default LedgerPage