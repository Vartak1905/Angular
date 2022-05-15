export const APP_URL = {

    /** URL TO ACCESS USER DETAILS */
    UMGMT_USER_LOGIN : '/cqruser/api/auth/login',
    UMGMT_GET_USER_DETAILS : '/cqruser/api/user/getUserDetails',
    UMGMT_GET_MENU_DETAILS : '/cqruser/api/menu/fetchMenuList',
    UMGMT_USER_LOGOUT : '/cqruser/api/auth/logout',
    UMGMT_RESET_PASSWORD : '/cqruser/api/auth/resetPasswordByToken',
    UMGMT_UPDATE_STATUS: '/cqruser/api/user/updateStatus',
    UMGMT_RESET_PASSWORD_MAIL: '/cqruser/api/user/sendResetPasswordMail',
    UMGMT_SEND_ACTIVATION_MAIL: '/cqruser/api/user/sendActivationMail',
    /** COMPANY ADMIN REQUEST URL */


    /** INSURANCE ADMIN REQUEST URL */


    /** CQR ADMIN REQUEST URL */


    /** CQR SUPER ADMIN REQUEST URL */


    BUSINESS_LOV_REGISTRATION : '/business/api/lov/getLovForRegistration',
    POLICY_LOV_REGISTRATION : '/business/api/lov/getLovForPolicyRegistration',
    BUSINESS_LOV_PROCESS_RULES : '/business/api/lov/getLovForPolicyRules',
    BUSINESS_ADD_CLIENT:  '/business/api/client/addClient',
    BUSINESS_FETCH_CLIENT:  '/business/api/client/fetchClient',
    BUSINESS_UPDATE_CLIENT:  '/business/api/client/saveClient',
    BUSINESS_SUBMIT_CLIENT:  '/business/api/client/submitClient',
    BUSINESS_GET_CLIENT_LISTING:  '/business/api/client/fetchAllClients',
    BUSINESS_ATTACHMENT_SAVE_ATT: '/business/api/attachment/saveAttachment',
    BUSINESS_ATTACHMENT_GET_ATT: '/business/api/attachment/getAttachment',
    BUSINESS_LOV_IPR_DOC_RULES : '/business/api/lov/getLovForIPRDoc',
    BUSINESS_LOV_IPR_DOC_TEMP : '/business/api/lov/getLovForIPRDocTemplate',
    BUSINESS_FETCH_DOCUMENT : '/business/api/document/getDocument',
    BUSINESS_FETCH_ALL_DOCUMENT : '/business/api/document/getAllDocument',
    BUSINESS_SAVE_COMMENT : '/business/api/comment/saveComment',
    BUSINESS_SAVE_DOCUMENT : '/business/api/document/saveDocument',
    BUSINESS_FETCH_ALL_ATTACH: '/business/api/attachment/getAllAttachments',
    BUSINESS_DELETE_ATTACHMENT: '/business/api/attachment/deleteAttachment',
    BUSINESS_GET_IPR_MIS_REPORT:  '/business/api/actlog/getIPRMISReport',
    BUSINESS_FETCH_DOCUMENT_BY_NAME : '/business/api/document/getDocByName',
    BUSINESS_DELETE_DOCUMENT: '/business/api/document/deleteDocument',
    BUSINESS_IPR_PROCESS_LISTING:  '/business/api/ipr/process/fetchAllByFilter',

    BUSINESS_FETCH_CURRENT_CLIENT:  '/business/api/client/fetchCurrentUserClient',
    BUSINESS_UPDATE_CURRENT_CLIENT:  '/business/api/client/updateClient',
    BUSINESS_FETCH_CURRENT_GROUP_POLICIES:  '/business/api/policy/fetchByCurrentOrg',
    BUSINESS_FETCH_CURRENT_SELF_POLICIES:  '/business/api/policy/fetchByCurrentUsername',
    SAVE_POLICY: '/business/api/policy/savePolicy ',
    FETCH_POLICY: '/business/api/policy/fetchPolicy',
    BUSINESS_RULES_FETCH:  '/business/api/rules/getRuleList',
    BUSINESS_RULES_SAVE:  '/business/api/rules/saveCombRules',
    BUSINESS_SAVE_RULES:  '/business/api/rules/saveRules',
    BUSINESS_SAVE_RULES_WITH_DATA:  '/business/api/rules/saveRulesWithData',
    BUSINESS_LOV_IPR_PROCESS : '/business/api/lov/getLovForIPRProcess',
    BUSINESS_LOV_FETCH_IPR_PROCESS : '/business/api/ipr/process/fetchProcess',
    BUSINESS_SAVE_IPR_PROCESS : '/business/api/ipr/process/save',
    
    BUSINESS_FETCH_ALL_IPR_STAGES : '/business/api/ipr/process/stages/fetchAll',
   
    BUSINESS_SAVE_ALL_IPR_INVITATIONS : '/business/api/ipr/invt/saveAll',
    BUSINESS_FETCH_ALL_INVITATIONS_BY_PROCESS_ID : '/business/api/ipr/invt/fetchAllByProcessId',

    //

    // USERS_LISTING: '/cqruser/api/user/getActiveUsers',
    USERS_LISTING: '/cqruser/api/user/getActiveUsers',
    USERS_LISTING_FILTER: '/cqruser/api/user/getActiveUsersByFilter',
    USER_LOV_REGISTRATION: '/cqruser/api/lov/getLovForUserAdd',
    USER_ORG_LIST: '/cqruser/api/org/getOrgList',
    INSURANCE_COMPANIES_LIST: '/business/api/client/getInsCompanies',
    USER_TEAM_LIST: '/cqruser/api/team/getTeamsForOrg',
    USER_ROLE_LIST: '/cqruser/api/role/getActiveRolesForTeam',
    USER_REGISTER: '/cqruser/api/user/saveUser',
    USER_SUBMIT: '/cqruser/api/user/submitUser',
    USER_ATTCHMENT_SAVE: '/cqruser/api/attachment/saveAttachment',
    USER_ATTCHMENT_GET: '/cqruser/api/attachment/getAttachment',
    USER_FETCH:'/cqruser//api/user/fetchUser',
    USER_CURRENT_FETCH:'/cqruser//api/user/fetchCurrentUser',
    USER_UPDATE:'/cqruser//api/user/updateUser',
    USERS_LISTING_BY_ROLE:'/cqruser/api/user/fetchUsersByRoleName',    
    WORKFLOW_PROCESS_REQUEST: '/workflow/api/req/processRequest',
    PENDING_REQUEST: '/workflow/api/req/geAllPendingRequest',
    PERFORMER_HISTORY: '/workflow/api/req/getPermorferHistory',
    TASK_LIST: '/notification/api/noti/fetchAllTaskList',
    IPR_RULE_LISTING: '/business/api/rules/getRulesList',
    FETCH_IPR_RULE: '/business/api/rules/fetchByFilter',
    PUBLISH_RULE: '/business/api/rules/publishRule',
    ADD_NEW_RULE: '/business/api/rules/addNewRule',
    BUSINESS_FETCH_DOCUMENT_BY_PROPERTIES : '/business/api/document/getDocByProp'
};
