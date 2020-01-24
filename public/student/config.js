var swc = {
    config : {
        baseUrl: "http://localhost:81/edms",
        // 统一拉出框
        indexDrawer: [
            { icon: 'mdi-contacts', text: 'Contacts' },
            { icon: 'mdi-history', text: 'Frequently contacted' },
            { icon: 'mdi-content-copy', text: 'Duplicates' },
            {
                icon: 'mdi-chevron-up',
                'icon-alt': 'mdi-chevron-down',
                text: 'Labels',
                model: true,
                children: [
                    { icon: 'mdi-plus', text: 'Create label' },
                ],
            },
            {
                icon: 'mdi-chevron-up',
                'icon-alt': 'mdi-chevron-down',
                text: 'More',
                model: false,
                children: [
                    { text: 'Import' },
                    { text: 'Export' },
                    { text: 'Print' },
                    { text: 'Undo changes' },
                    { text: 'Other contacts' },
                ],
            },
            { icon: 'mdi-settings', text: 'Settings' },
            { icon: 'mdi-message', text: 'Send feedback' },
            { icon: 'mdi-help-circle', text: 'Help' },
            { icon: 'mdi-cellphone-link', text: 'App downloads' },
            { icon: 'mdi-keyboard', text: 'Go to the old version' },
        ]
    },
    utils : {
        checkRes : function(res) {
            if(res.code == '4003') {
                alert('请登陆');
                location.href = swc.config.baseUrl + '/student/login.html';
            }
            if(res.code != '2000') {
                alert(res.error_message);
                return false;
            }
            return true;
        },
        ls : {
            set : function(key, value) {
                localStorage.setItem(key, value);
            },
            get : function(key) {
                return localStorage.getItem(key);
            },
            setObject : function(key, value) {
                localStorage.setItem(key, JSON.stringify(value));
            },
            getObject : function(key) {
                return JSON.parse(localStorage.getItem(key));
            },
            clear : function(key) {
                localStorage.clear(key);
            }
        }
    }
}