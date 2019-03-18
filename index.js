var pug = require('pug');
var parse = require('node-html-parser').parse;

exports.Service = function (apiKey, serviceName, verbs) {
    this.apiKey = apiKey;
    this.serviceName = serviceName;
    this.verbs = verbs;
    this.menus = [];
    this.forms = [];
}

function Form(index, template, data) {
    this.template = template;
    this.data = data;
    this.index = index;
    this.type = "form";
}

Form.prototype.header = function (header) {
    if (typeof header !== 'undefined') {
        this.headerValue = header;
        return true;
    } else {
        return this.headerValue;
    }
}

Form.prototype.footr = function (footer) {
    if (typeof footer !== 'undefined') {
        this.footerValue = footer;
        return true;
    } else {
        return this.footerValue;
    }
}

Form.prototype.render = function () {

    var self = this;
    var html = pug.renderFile(this.template, this.data);
    var root = parse(html);
    var result = {};

    result.type = this.type;
    result.body = [];
    result.nextRoute = root.childNodes[0].attributes['submit'];
    result.method = root.childNodes[0].attributes['method'].toUpperCase();

    var form = root.childNodes[0];

    for (var i = 0; i < form.childNodes.length; i++) {
        var record = undefined;
        switch (form.childNodes[i].tagName) {
            case "footer":
                self.footer(root.childNodes[i].text);
                break;
            case "header":
                record = {};
                record.type = "header";
                self.header(root.childNodes[i].text);
                break;
            case "p":
                record = {};
                try {
                    record.description = typeof form.childNodes[i].text !== 'undefined' ?
                        form.childNodes[i].text
                        :
                        undefined;
                    record.name = typeof form.childNodes[i].childNodes[1] !== 'undefined' ?
                        form.childNodes[i].childNodes[1].attributes['name']
                        :
                        undefined;
                    record.type = typeof form.childNodes[i].childNodes[1] !== 'undefined' ?
                        form.childNodes[i].childNodes[1].attributes['type']
                        :
                        undefined;
                } catch (error) {
                    record = {};
                }
                break;
            default:
                break;
        }
        if (record) result.body.push(record);
    }

    result.header = this.header();
    result.footer = this.footer();

    return result;
}

function Menu(index, template, data) {
    this.template = template;
    this.data = data;
    this.index = index;
    this.type = "menu";
}

Menu.prototype.header = function (header) {
    if (typeof header !== 'undefined') {
        this.headerValue = header;
        return true;
    } else {
        return this.headerValue;
    }
}

Menu.prototype.footer = function (footer) {
    if (typeof footer !== 'undefined') {
        this.footerValue = footer;
        return true;
    } else {
        return this.footerValue;
    }
}

Menu.prototype.render = function () {

    var self = this;

    var html = pug.renderFile(this.template, this.data);
    var root = parse(html);
    var result = {};

    result.type = this.type;
    result.body = [];
    for (var i = 0; i < root.childNodes.length; i++) {
        var record = undefined;
        switch (root.childNodes[i].tagName) {
            case "footer":
                self.footer(root.childNodes[i].text);
                break;
            case "header":
                self.header(root.childNodes[i].text);
                break;
            case "option":
                record = {};
                record.type = "option";
                record.description = root.childNodes[i].text;
                record.nextRoute = root.childNodes[i].attributes['href'];
                record.method = typeof root.childNodes[i].attributes['method'] !== 'undefined' ?
                    root.childNodes[i].attributes['method'].toUpperCase()
                    :
                    'GET';
                break;
            case "p":
                record = {};
                record.type = "content";
                record.description = root.childNodes[i].text;
                break;
            default:
                break;
        }
        if (record) result.body.push(record);
    }
    result.header = this.header();
    result.footer = this.footer();
    return result;
}

exports.Service.prototype.addForm = function (template, data) {
    var form = new Form(this.forms.length, template, data);
    this.forms.push(form);
    return this.forms[this.forms.length - 1];
}

exports.Service.prototype.addMenu = function (template, data) {
    var menu = new Menu(this.menus.length, template, data);
    this.menus.push(menu);
    return this.menus[this.menus.length - 1];
}

