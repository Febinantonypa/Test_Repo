/*
 * Copyright (c) 1998-2018 NetSuite, Inc. 2955 Campus Drive, Suite 100, San
 * Mateo, CA, USA 94403-2511 All Rights Reserved. This software is the
 * confidential and proprietary information of NetSuite, Inc. ("Confidential
 * Information"). You shall not disclose such Confidential Information and shall
 * use it only in accordance with the terms of the license agreement you entered
 * into with NetSuite.
 */

/**
 * Developer Certification
 * 
 * Objective:
 *     Identify the risks of implementing only client-side validations and
 *     strategies to address them.
 * 
 * This is a User Event script that is performing a validation at Before Submit.
 * Place the validation on the client-side for maximum flexibility, but repeat
 * on the server for safety in case the script does not execute in the browser.

 * In addition to the safety aspect, records may be updated from other contexts
 * than the user interface (e.g. csv import, web services). If you place the
 * validation in the user event script, then the validation will be in place
 * from anywhere the record is updated. Client-side scripts are not executed when
 * records are updated from outside the user interface. 
 * 
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/error'],

function(error) {
    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type
     * @Since 2015.2
     */
    function beforeSubmit(scriptContext) {
       var opportunity = scriptContext.newRecord;
       
       var projectedTotal = opportunity.getValue({fieldId: 'projectedtotal'});
          
       if (projectedTotal > 500){
          // Throws an exception that cancels submittal of record to the database
          throw 'Total is greater than the allowable limit';
       }
    }

    return {
        beforeSubmit: beforeSubmit
    };
});
