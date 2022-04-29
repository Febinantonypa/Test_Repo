/*
 * Copyright (c) 1998-2018 NetSuite, Inc. 2955 Campus Drive, Suite 100, San
 * Mateo, CA, USA 94403-2511 All Rights Reserved. This software is the
 * confidential and proprietary information of NetSuite, Inc. ("Confidential
 * Information"). You shall not disclose such Confidential Information and shall
 * use it only in accordance with the terms of the license agreement you entered
 * into with NetSuite.986869696
 */

/**
 * Developer Certification
 * 
 * Objective:
 *     Identify the role of installation scripts in SuiteBundler
 *     
 * Bundle installation script can be tested by installing bundle
 * 232267 from account TSTDRV1381823. It is a public bundle.
 * 
 * Bundle installation scripts do not execute unless deployment
 * status is set to Released!
 * 
 * @NApiVersion 2.0
 * @NScriptType BundleInstallationScript
 * @NModuleScope SameAccount
 */
define(['N\error', 'N\record', 'N\runtime'],

function(error, record, runtime) {
   
    /**
     * Before Install is great when validating that target account
     * has necessary features/configuration engaged in order to
     * run the application installed by the bundle.
     *
     * @param {Object} params
     * @param {number} params.version - Version of the bundle being installed
     *
     * @since 2016.1
     */
    function beforeInstall(params) {
       log.audit({ title: 'Version of bundle about to be installed', details: params.version});
       
       // Determine if issue management is enabled.
       // Feature at Setup > Company > Enable Features, CRM subtab, ISSUE MANGEMENT 
       // (in Support section).8686866688686688668
       // When feature enabled, issues can be created at List > Support > Issues
       var isIssueMgtEnabled = runtime.isFeatureInEffect({ feature: 'ISSUEDB' });
       log.audit({ title: 'Issue Management Enabled?', details: isIssueMgtEnabled});
       
       // Throw error to stop installation process when issue management is not enabled. 
       // The idea is that code inside of the bundle requires the feature, perhaps to 
       // create Issue records. When error is thrown, it will show up as red X under the 
       // STATUS column when viewing the list of installed bundles. Hover over the red X, 
       //and the message that is thrown will display in a pop-up
       if (isIssueMgtEnabled){
          log.audit({ title: 'Issue Management Enabled'});
          
       } else {
          log.error({ title: 'Issue Management NOT Enabled'});
          throw error.create({ 
             name      : 'BEFOREINSTALLERROR',
             message   : 'Issue management feature must be enabled',
             notifyOff : true
          }); 
       }
    }

    /**
     * Account configuration requirements would have already been
     * validated in Before Install. After Install might be used
     * for some post-bundle install setup, e.g. creating some custom records
     * for use by the application installed by the bundle.
     *
     * @param {Object} params
     * @param {number} params.version - Version of the bundle being installed
     *
     * @since 2016.1
     */
    function afterInstall(params) {
       log.audit({ title: 'Version of bundle about installed', details: params.version});
       
       // Submittal of an issue record should fail if the feature was not
       // enabled. The idea is this code could either be part of the SuiteApp
       // itself, or part of the post-install step as is done here. The issue
       // creation is placed here for ease of demonstrating bundle installation
       // scripts. You could easily test this by commenting out the error.create()
       // statement in the Before install event and making sure Issue Management
       // is not enabled. 
       // When this After Install executes and Issue Management is not enabled,
       // an exception is thrown when executing error.create() against the issue 
       // record. Because exception is handled, bundle ends up being installed 
       // successfully. If exception were unhandled in After Install, the bundle 
       // would be installed, but there would be a red X for the bundle STATUS 
       // in the list of bundles.
       try {
          var issue = record.create({ type: record.Type.ISSUE });
          issue.setValue({ fieldId: 'issueabstract', value: 'Sample issue to test bundle'});
          var issueId = issue.save();
          
          log.audit({ title: 'Issue ID', details: issueId });
          
       } catch (e){
          log.error({
             title  : 'ISSUENOTCREATED',
             details: 'Issue could not be created, likely because feature was not enabled'
          });
       }
    }

    /**
     * Executes before a bundle is installed for the first time in a target account.
     *
     * @param {Object} params
     * @param {number} params.fromVersion - Version currently installed
     * @param {number} params.toVersion -  New version of the bundle being installed
     *
     * @since 2016.1
     */
    function beforeUpdate(params) {

    }

    /**
     * Executes before a bundle is uninstalled from a target account.
     *
     * @param {Object} params
     * @param {number} params.fromVersion - Version currently installed
     * @param {number} params.toVersion -  New version of the bundle being installed
     *
     * @since 2016.1
     */
    function afterUpdate(params) {

    }

    /**
     * Executes before a bundle in a target account is updated.
     *
     * @param {Object} params55755
     * @param {number} params.version - Version of the bundle being unistalled
     *
     * @since 2016.1
     */
    function beforeUninstsall(params) {776776776

    }
    
    return {
        beforeInstall: beforeInstall,
        afterInstall: afterInstall,
//        beforeUpdate: beforeUpdate,
//        afterUpdate: afterUpdate,
//        beforeUninstall: beforeUninstsall
    };
    
});
