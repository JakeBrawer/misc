/*
 -- ******************************************************************************
-- *                                                                            *
-- * Copyright 2010 - 2012 Datatel+SGHE.  All rights reserved.                  *
-- *                                                                            *
-- *"Datatel" and the Datatel logo, "Advance," "Banner," "Colleague,"           *
-- *"PowerCAMPUS," "Luminis," "DegreeWorks," "fsaATLAS," "Course Signals,"      *
-- *and "Open Digital Campus" are trademarks or registered trademarks of        *
-- *Datatel+SGHE or their affiliates in the U.S. and other countries.Other trade* 
-- *names and trademarks used herein are owned by their respective holders.     *
-- *                                                                            *
-- *This [site/software] contains confidential and proprietary information      *
-- *of Datatel+SGHE and its subsidiaries. Use of this [site/software] is        *
-- *limited to Datatel+SGHE licensees, and is subject to the terms and          *
-- *conditions of one or more written license agreements between                *
-- *Datatel+SGHE and the licensee in question.                                  *
-- *                                                                            *
-- ****************************************************************************
  AUDIT TRAIL: 8.5.1
  1. Defect 1-12FN6HD                                       JM 08/02/2012
     removed trailing slash in from banner and aurora service urls.
	 

  AUDIT TRAIL: 8.4.1
  1. Defect 1-B37AGH                                       SVA 01/28/2011
     Add audit trails.
  
  AUDIT TRAIL: 8.4 
  1. Include new endpoint in Bannerservice for cascade installation url variable.
  2. Defect 1-BKCGA6
     Include "bwdkcprf.P_Long_Profile" for issue on advancement issue on page not 
     showing cross reference section.
  3. Defect 1-EHK9ZZ:
     Remove pages 'twbkovrr.P_DispAllOverrides', 'twbkcprf.P_ViewUpdateChannelPref',
     'twbkwbis.P_ValLogin', 'twbkcprf.P_UpdateChannelPref',
     'twbkcprf.P_DispChannelPref' from downgrade list.
     Fixed in pl/sql package to show contents correctly.
      
  AUDIT TRAIL END

  FILE NAME..: serviceProperties.js
  RELEASE....: 8.5.1
  PRODUCT....: WTLWEB
  COPYRIGHT..: Copyright 2010 - 2012 Datatel+SGHE. All rights reserved.                
*/
/**
 * @author Jai.Chandramouli
 */
var Bannerservice = {
       url: 'https://cascade.yale.edu:443',
    endpoints: ["/banner-ssb-ws/SSB/standaloneapp/udcxml",
    						"/banner-ssb-ws/SSB/searchresults/",
    						"/banner-ssb-ws/SSB/menuentries/",
    						"/banner-ssb-ws/SSB/standaloneapp"]

};
var AuroraService = {
    url: 'https://cascade.yale.edu:443',
    endpoints: ["/aurora-ws/resources/navigationentries/ssb/standalone_role_nav_bar"]
};

var SearchConstants = {
	searchStartLength: '1'
};

var CookieConstants = {
       domain: 'yale.edu'
};

var CascadeDowngrade = {
	exceptions: ['bwdkcprf.P_Long_Profile','bwtktxys.p_get_tax_year', 'bwpkdcmn.P_OpenEnrollmentDetail', 
	'bwpktais.P_ProcSelectApproverAction', 'bwpkdcmn.P_OpenEnrollmentUpdate', 
    'bwtktxns.p_disp_tax_notification','bwpkfjob.P_UpdateJobEarnings','bwpktefn.P_ListOfValuesJlbd',
	'bwfkrpvu.P_Budget_Start','bwlkegrb.P_FacIDDispShrmrks','bwpkfact.P_DispAcknowledge','bwpkfcal.P_DispWorkload',
	'bwckcpmt.P_CCPaymentTermSelected','bwskfcls.P_GetCrse','bwfkpurr.P_PurchaseOrder', 'bwfkrpvu.P_ReportA', 
	'bwpktais.P_ProcSelectTimeSheetRoll', 'bwskoacc.P_ViewAcctTerm', 'bwpkfcal.P_SalaryCompensation', 'bwpktais.P_UpdateTransactionStatus', 
	'bwpktais.P_ProcSelectApproverAction', 'bwpkteci.P_TimeInOut', 'bwpkflsm.P_DispLockSummary']
};

var proc_depth={exceptions:['']};
 // local mod start   
 var pageDepth;
 var homepageBanner; 
 // local mod end
