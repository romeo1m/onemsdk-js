const snakecase = require('snakecase-keys');
const tags = require('./tag');
const UlTag = tags.UlTag,
    SectionTag = tags.SectionTag,
    FormTag = tags.FormTag,
    LiTag = tags.LiTag,
    ATag = tags.ATag,
    HeaderTag = tags.HeaderTag,
    FooterTag = tags.FooterTag,
    InputTag = tags.InputTag;


/**
 Instantiates a new Form

 @class Form
 @classdesc A Form object as defined in the JSON schema

 @param {object} props - Properties to initialize the Form with
 @param {Array<FormItem>} props.body - Sets {@link Form#body}
 @param {('GET'|'POST'|'PUT'|'PATCH'|'DELETE'|'HEAD'|'OPTIONS'|'TRACE')} props.method='POST' - Sets {@link Form#method}
 @param {string} props.path - Sets {@link Form#path}
 @param {string} [props.header] - Sets {@link Form#header}
 @param {string} [props.footer] - Sets {@link Form#footer}
 @param {FormMeta} [props.meta] - Sets {@link Form#meta}
 */
function Form(props) {
    if (!props.body || !props.path) {
        throw Error('(body, path) are mandatory');
    }
    /**
     This is the Form's type

     @name Form#type
     @type {string}
     @default "form"
     @readonly
     */
    this.type = 'form';
    /**
     This is the Form's body

     @name Form#body
     @type {Array<FormItem>}
     */
    this.body = props.body;
    /**
     This is the Form's method

     @name Form#method
     @type {string}
     @default "POST"
     */
    this.method = props.method || 'POST';
    /**
     This is the Form's path

     @name Form#path
     @type {string}
     */
    this.path = props.path;
    /**
     This is the Form's generic header. It is used in those `FormItem`s
     which don't define a header.

     @name Form#header
     @type {string}
     */
    this.header = props.header || null;
    /**
     This is the Form's footer. It is inherited by those `FormItem`s
     which don't define a footer.

     @name Form#footer
     @type {string}
     */
    this.footer = props.footer || null;
    /**
     This is the Form's meta. It contains the form configuration

     @name Form#meta
     @type {FormMeta}
     */
    this.meta = props.meta || null;
}

/**
 * Creates a Form from a FormTag
 * @param {FormTag} formTag
 * @returns {Form}
 */
Form.fromTag = function (formTag) {
    let body = [];
    for (const sectionTag of formTag.children) {
        body.push(FormItem.fromTag(sectionTag));
    }

    return new Form({
        body: body,
        method: formTag.attrs.method,
        path: formTag.attrs.action,
        header: formTag.attrs.header,
        footer: formTag.attrs.footer,
        meta: new FormMeta({
            completionStatusShow: formTag.attrs.completionStatusShow,
            completionStatusInHeader: formTag.attrs.completionStatusInHeader,
            confirmationNeeded: formTag.attrs.confirmationNeeded
        })
    });
};

/**
 Instantiates a new FormMeta

 @class FormMeta
 @classdesc A FormMeta object as defined in the JSON schema

 @param {object} props - Properties to initialize the FormMeta with
 @param {boolean} [props.completionStatusShow] - Sets {@link FormMeta#completionStatusShow}
 @param {boolean} [props.completionStatusInHeader] - Sets {@link FormMeta#completionStatusInHeader}
 @param {boolean} [props.confirmationNeeded] - Sets {@link FormMeta#confirmationNeeded}
 */
function FormMeta(props) {
    /**
     Whether to show or not the completion status in each {@link FormItem}.

     @name FormMeta#completionStatusShow
     @type {boolean}
     @default false
     */
    this.completionStatusShow = props.completionStatusShow;

    /**
     Whether to show or not the completion status in header. It has effect
     only if {@link FormMeta#completionStatusShow} is `true`.

     @name FormMeta#completionStatusInHeader
     @type {boolean}
     @default false
     */
    this.completionStatusInHeader = props.completionStatusInHeader;

    /**
     Whether to show an extra step at the end of the {@link Form} to visualize
     and check the form responses.

     @name FormMeta#confirmationNeeded
     @type {boolean}
     @default false
     */
    this.confirmationNeeded = props.confirmationNeeded;
}

/**
 * Instantiates a new FormItem
 *
 * @class FormItem
 * @classdesc A FormItem object as defined in the JSON schema
 *
 * @param {object} props - Properties to initialize the form item with
 * @param {('string'|'date'|'datetime'|'int'|'float'|'hidden'|'form-menu'|
 * 'email'|'url'|'location')} props.type - Sets {@link FormItem#type}
 * @param {string} props.name - Sets {@link FormItem#name}
 * @param {string} props.description - Sets {@link FormItem#description}
 * @param {string} [props.header] - Sets {@link FormItem#header}
 * @param {string} [props.footer] - Sets {@link FormItem#footer}
 * @param {Array<MenuItemFormItem>} [props.body] - Sets {@link FormItem#body}
 * @param {string} [props.value] - Sets {@link FormItem#value}
 * @param {string} [props.chunkingFooter] - Sets {@link FormItem#chunkingFooter}
 * @param {string} [props.confirmationLabel] - Sets {@link FormItem#confirmationLabel}
 * @param {number} [props.minLength] - Sets {@link FormItem#minLength}. It must be integer.
 * @param {string} [props.minLengthError] - Sets {@link FormItem#minLengthError}
 * @param {number} [props.maxLength] - Sets {@link FormItem#maxLength}. It must be integer.
 * @param {string} [props.maxLengthError] - Sets {@link FormItem#maxLengthError}
 * @param {number} [props.minValue] - Sets {@link FormItem#minValue}
 * @param {string} [props.minValueError] - Sets {@link FormItem#minValueError}
 * @param {number} [props.maxValue] - Sets {@link FormItem#maxValue}
 * @param {string} [props.maxValueError] - Sets {@link FormItem#maxValueError}
 * @param {MenuFormItemMeta} [props.meta] - Sets {@link FormItem#meta}
 * @param {string} [props.method] - Sets {@link FormItem#method}
 * @param {boolean} [props.required=false] - Sets {@link FormItem#required}
 * @param {boolean} [props.statusExclude=false] - Sets {@link FormItem#statusExclude}
 * @param {boolean} [props.statusPrepend=false] - Sets {@link FormItem#statusPrepend}
 * @param {string} [props.url] - Sets {@link FormItem#url}
 * @param {string} [props.validateTypeError] - Sets {@link FormItem#validateTypeError}
 * @param {string} [props.validateTypeErrorFooter] - Sets {@link FormItem#validateTypeErrorFooter}
 * @param {string} [props.validateUrl] - Sets {@link FormItem#validateUrl}
 * @constructor
 */
function FormItem(props) {
    /**
     This is the FormItem's type

     @name FormItem#type
     @type {string}
     */
    this.type = props.type;

    const supportedTypes = [
        'date', 'datetime', 'email', 'form-menu', 'float', 'hidden', 'int',
        'location', 'string', 'url'
    ];

    if (supportedTypes.indexOf(this.type) === -1) {
        throw Error(`FormItem type="${this.type}" is not supported. Supported types: ${supportedTypes}`);
    }

    /**
     This is the FormItem's name. Each form item name must be unique within the same form.

     @name FormItem#name
     @type {string}
     */
    this.name = props.name;
    /**
     This is the FormItem's displayed text.

     @name FormItem#description
     @type {string}
     */
    this.description = props.description;
    /**
     This is the FormItem's header. If defined, it overrides {@link Form#header}.

     @name FormItem#header
     @type {string}
     */
    this.header = props.header || null;
    /**
     This is the FormItem's footer. If defined, it overrides {@link Form#footer}.

     @name FormItem#footer
     @type {string}
     */
    this.footer = props.footer || null;
    /**
     This is the FormItem's body.

     @name FormItem#body
     @type {Array<MenuItemFormItem>}
     */
    this.body = props.body || null;
    /**
     `value` must be set only if {@link FormItem#type} is `hidden`.

     @name FormItem#value
     @type {string}
     */
    this.value = props.value || null;

    if (this.value == null) {
        if (this.type === 'hidden') {
            throw Error('value is required when type="hidden"');
        }
    }

    /**
     This is the FormItem's chunking footer.

     @name FormItem#chunkingFooter
     @type {string}
     */
    this.chunkingFooter = props.chunkingFooter || null;
    /**
     This is the FormItem's confirmation label.

     @name FormItem#confirmationLabel
     @type {string}
     */
    this.confirmationLabel = props.confirmationLabel || null;
    /**
     This defines the minimum length of the input if {@link FormItem#type}
     is `string`. It must be an integer.

     @name FormItem#minLength
     @type {number}
     */
    this.minLength = props.minLength || null;
    /**
     This is the error for {@link FormItem#minLength}.

     @name FormItem#minLengthError
     @type {string}
     */
    this.minLengthError = props.minLengthError || null;
    /**
     This defines the maximum length of the input if {@link FormItem#type}
     is `string`. It must be an integer.

     @name FormItem#maxLength
     @type {number}
     */
    this.maxLength = props.maxLength || null;
    /**
     This is the error for {@link FormItem#maxLength}.

     @name FormItem#maxLengthError
     @type {string}
     */
    this.maxLengthError = props.maxLengthError || null;
    /**
     This defines the minimum value of the input if {@link FormItem#type}
     is `int` or `float`.

     @name FormItem#minValue
     @type {number}
     */
    this.minValue = props.minValue || null;
    /**
     This is the error for {@link FormItem#minValue}.

     @name FormItem#minValueError
     @type {string}
     */
    this.minValueError = props.minValueError || null;
    /**
     This defines the maximum value of the input if {@link FormItem#type}
     is `int` or `float`.

     @name FormItem#maxValue
     @type {number}
     */
    this.maxValue = props.maxValue || null;
    /**
     This is the error for {@link FormItem#maxValue}.

     @name FormItem#minValueError
     @type {string}
     */
    this.maxValueError = props.maxValueError || null;
    /**
     This must be defined if {@link FormItem#type} is `form-item`.

     @name FormItem#meta
     @type {MenuFormItemMeta}
     */
    this.meta = props.meta || null;
    /**
     This is the FormItem's method.

     @name FormItem#method
     @type {string}
     */
    this.method = props.method || null;
    /**
     Whether the form item is required to be answered or not.

     @name FormItem#required
     @type {boolean}
     @default false
     */
    this.required = props.required || false;
    /**
     Whether the form item's status should be excluded or not.

     @name FormItem#statusExclude
     @type {boolean}
     @default false
     */
    this.statusExclude = props.statusExclude || false;
    /**
     Whether the form item's status should be prepended or not.

     @name FormItem#statusPrepend
     @type {boolean}
     @default false
     */
    this.statusPrepend = props.statusPrepend || false;
    /**
     This is the FormItem's url.

     @name FormItem#url
     @type {string}
     */
    this.url = props.url || null;
    /**
     This is the FormItem's validation type error.

     @name FormItem#validateTypeError
     @type {string}
     */
    this.validateTypeError = props.validateTypeError || null;
    /**
     This is the FormItem's validation type error footer.

     @name FormItem#validateTypeErrorFooter
     @type {string}
     */
    this.validateTypeErrorFooter = props.validateTypeErrorFooter || null;
    /**
     This is the FormItem's validation url.

     @name FormItem#validateUrl
     @type {string}
     */
    this.validateUrl = props.validateUrl || null;
}

/**
 * Creates a FormItem from a SectionTag
 * @param {SectionTag} sectionTag
 * @returns {FormItem}
 */
FormItem.fromTag = function (sectionTag) {
    let header,
        footer,
        body = [],
        value,
        minValue,
        minValueError,
        minLength,
        minLengthError,
        maxValue,
        maxValueError,
        maxLength,
        maxLengthError,
        formItemType;

    for (const child of sectionTag.children) {
        if (child instanceof InputTag) {
            const inputType = child.attrs.type;
            if (inputType === 'number') {
                if (child.attrs.step === 1) {
                    formItemType = 'int';
                } else {
                    formItemType = 'float';
                }
            } else if (inputType === 'hidden') {
                value = child.attrs.value;
                formItemType = 'hidden';
                if (value === undefined) {
                    throw Error('value attribute is required for input type="hidden"');
                }
            } else {
                switch (inputType) {
                    case 'text':
                        formItemType = 'string';
                        break;
                    case 'date':
                        formItemType = 'date';
                        break;
                    case 'datetime':
                        formItemType = 'datetime';
                        break;
                    case 'url':
                        formItemType = 'url';
                        break;
                    case 'email':
                        formItemType = 'email';
                        break;
                    case 'location':
                        formItemType = 'location';
                        break;
                    default:
                        throw Error(`<input/> type "${inputType}" is not supported`);
                }
            }

            minValue = child.attrs.min;
            minValueError = child.attrs.minError;
            minLength = child.attrs.minlength;
            minLengthError = child.attrs.minlengthError;
            maxValue = child.attrs.max;
            maxValueError = child.attrs.maxError;
            maxLength = child.attrs.maxlength;
            maxLengthError = child.attrs.maxlengthError;

            break; // ignore other <input> tags if exist
        }
        if (child instanceof UlTag) {
            formItemType = 'form-menu';
            for (const li of child.children) {
                body.push(MenuItemFormItem.fromTag(li));
            }
            break;
        }
    }

    if (!formItemType) {
        throw Error('When <section> plays the role of a form item, ' +
            'it must contain a <input/> or <ul></ul>'
        )
    }

    if (sectionTag.children[0] instanceof HeaderTag) {
        header = sectionTag.children[0].toString();
    }
    if (sectionTag.children[sectionTag.children.length - 1] instanceof FooterTag) {
        footer = sectionTag.children[sectionTag.children.length - 1].toString();
    }

    return new FormItem({
        type: formItemType,
        name: sectionTag.attrs.name,
        description: sectionTag.toString(true, true),
        header: header || sectionTag.attrs.header,
        footer: footer || sectionTag.attrs.footer,
        body: body.length === 0 ? undefined : body,
        value: value,
        chunkingFooter: sectionTag.attrs.chunkingFooter,
        confirmationLabel: sectionTag.attrs.confirmationLabel,
        minLength: minLength,
        minLengthError: minLengthError,
        maxLength: maxLength,
        maxLengthError: maxLengthError,
        minValue: minValue,
        minValueError: minValueError,
        maxValue: maxValue,
        maxValueError: maxValueError,
        meta: new MenuFormItemMeta({
            autoSelect: sectionTag.attrs.autoSelect,
            multiSelect: sectionTag.attrs.multiSelect,
            numbered: sectionTag.attrs.numbered
        }),
        method: sectionTag.attrs.method,
        required: sectionTag.attrs.required,
        statusExclude: sectionTag.attrs.statusExclude,
        statusPrepend: sectionTag.attrs.statusPrepend,
        url: sectionTag.attrs.url,
        validateTypeError: sectionTag.attrs.validateTypeError,
        validateTypeErrorFooter: sectionTag.attrs.validateTypeErrorFooter,
        validateUrl: sectionTag.attrs.validateUrl
    });
};


/**
 Instantiates a new MenuFormItemMeta

 @class MenuFormItemMeta
 @classdesc A MenuFormItemMeta object as defined in the JSON schema

 @param {object} props - Properties to initialize the MenuFormItemMeta object with
 @param {boolean} [props.autoSelect=false] - Sets {@link MenuFormItemMeta#autoSelect}
 @param {boolean} [props.multiSelect=false] - Sets {@link MenuFormItemMeta#multiSelect}
 @param {boolean} [props.numbered=false] - Sets {@link MenuFormItemMeta#numbered}
 */
function MenuFormItemMeta(props) {
    /**
     Will be automatically selected if set to true and in case of a single
     option in the menu.

     @name MenuFormItemMeta#autoSelect
     @type {boolean}
     @default false
     */
    this.autoSelect = props.autoSelect || false;

    /**
     It allows multiple options to be selected.

     @name MenuFormItemMeta#multiSelect
     @type {boolean}
     @default false
     */
    this.multiSelect = props.multiSelect || false;

    /**
     Display numbers instead of letter option markers.

     @name MenuFormItemMeta#numbered
     @type {boolean}
     @default false
     */
    this.numbered = props.numbered || false;
}

/**
 * Instantiates a new MenuItemFormItem
 *
 * @class MenuItemFormItem
 * @classdesc A MenuItemFormItem object as defined in the JSON schema. It
 * represents an item in a form's menu.
 *
 * @param {object} props - Properties to initialize the MenuItemFormItem with
 * @param {string} props.description - Sets {@link MenuItemFormItem#description}
 * @param {string} [props.textSearch] - Sets {@link MenuItemFormItem#textSearch}
 * @param {string} [props.value] - Sets {@link MenuItemFormItem#value}
 */
function MenuItemFormItem(props) {
    /**
     The type of a menu item inside a form, either `"option"` or `"content"`.

     @name MenuItemFormItem#type
     @type {string}
     @readonly
     */
    this.type = 'content';

    if (props.value !== undefined) {
        this.type = 'option';
    }

    /**
     The description of this MenuItemFormItem.

     @name MenuItemFormItem#description
     @type {string}
     */
    this.description = props.description;

    /**
     The value of this MenuItemFormItem, used in form serialization.

     @name MenuItemFormItem#value
     @type {string}
     */
    this.value = props.value || null;

    /**
     Field to add more context for searching in options.

     @name MenuItemFormItem#textSearch
     @type {string}
     */
    this.textSearch = props.textSearch || null;
}

/**
 * Creates a MenuItemFormItem from a SectionTag's child
 * @param tag
 * @returns {MenuItemFormItem}
 */
MenuItemFormItem.fromTag = function (tag) {
    let description,
        textSearch,
        value;

    if (typeof tag === 'string') {
        description = tag;
    } else {
        description = tag.toString();
    }

    if (!description) {
        // Ignore the menu items without text
        return undefined;
    }

    if (tag instanceof LiTag) {
        value = tag.attrs.value;
        textSearch = tag.attrs.textSearch;
    }

    return new MenuItemFormItem({
        description: description,
        value: value,
        textSearch: textSearch
    });
};

/**
 * Instantiates a new Menu
 *
 * @class Menu
 * @classdesc A Menu object as defined in the JSON schema. It represents
 * a top level component that permits displaying a navigable menu or a plain text.
 *
 * @param {object} props - Properties to initialize the menu with
 * @param {Array<MenuItem>} props.body - Sets {@link Menu#body}
 * @param {string} [props.header] - Sets {@link Menu#header}
 * @param {string} [props.footer] - Sets {@link Menu#footer}
 * @param {MenuMeta} [props.meta] - Sets {@link Menu#meta}
 */
function Menu(props) {
    /**
     The type of the Menu object is always "menu".

     @name Menu#type
     @type {string}
     @readonly
     */
    this.type = "menu";
    /**
     The body/content of the menu.

     @name Menu#body
     @type {Array<MenuItem>}
     @default "menu"
     */
    this.body = props.body;
    /**
     The header of the menu.

     @name Menu#header
     @type {string}
     */
    this.header = props.header || null;
    /**
     The footer of the menu.

     @name Menu#footer
     @type {string}
     */
    this.footer = props.footer || null;
    /**
     Configuration fields for menu.

     @name Menu#meta
     @type {MenuMeta}
     */
    this.meta = props.meta || null;
}

/**
 * Creates a Menu from a SectionTag
 * @param {SectionTag} sectionTag
 * @returns {Menu}
 */
Menu.fromTag = function (sectionTag) {
    let body = [],
        header,
        footer;

    sectionTag.children.forEach(function (child) {
        if (child instanceof UlTag) {
            child.children.forEach(function (liTag) {
                body.push(MenuItem.fromTag(liTag));
            });
        } else if (child instanceof HeaderTag) {
            header = child.toString();
        } else if (child instanceof FooterTag) {
            footer = child.toString();
        } else {
            body.push(MenuItem.fromTag(child));
        }
    });

    // Discard all the menu items evaluated to false (eg: those with no description)
    body = body.filter(function (menuItem) {
        return menuItem;
    });

    return new Menu({
        body: body,
        header: header || sectionTag.attrs.header,
        footer: footer || sectionTag.attrs.footer,
        meta: new MenuMeta({
            autoSelect: sectionTag.attrs.autoSelect
        })
    });
};

/**
 Instantiates a new MenuMeta

 @class MenuMeta
 @classdesc A MenuMeta object as defined in the JSON schema. It contains
 configuration fields for {@link Menu}.

 @param {object} props - Properties to initialize the menu meta with
 @param {boolean} [props.autoSelect=false] - Sets {@link MenuMeta.autoSelect}
 */
function MenuMeta(props) {
    /**
     If the Menu has only one option, it is automatically selected, without
     asking the user for selection.

     @name MenuMeta#autoSelect
     @type {boolean}
     @default false
     */
    this.autoSelect = props.autoSelect || false;
}

/**
 Instantiates a new MenuItem

 @class MenuItem
 @classdesc A MenuItem object as defined in the JSON schema. It represents an item
 in a menu. Depending on its type, a menu item can be either an option
 (type=option) or an option separator (type=content).

 @param {object} props - Properties to initialize the menu item with.
 @param {string} props.description - Sets {@link MenuItem#description}
 @param {string} [props.textSearch] - Sets {@link MenuItem#textSearch}
 @param {('GET'|'POST'|'PUT'|'PATCH'|'DELETE'|'HEAD'|'OPTIONS'|'TRACE')} [props.method] - Sets {@link MenuItem#method}
 @param {string} [props.path] - Sets {@link MenuItem#path}
 */
function MenuItem(props) {
    /**
     The type of the menu item (`content` or `option`).

     @name MenuItem#type
     @type {string}
     @readonly
     */
    this.type = 'content';

    if (props.path !== undefined) {
        this.type = 'option';
    }

    /**
     The displayed text of a menu item.

     @name MenuItem#description
     @type {string}
     */
    this.description = props.description;

    /**
     Field to add more context for searching in options.

     @name MenuItem#textSearch
     @type {string}
     */
    this.textSearch = props.textSearch || null;

    /**
     The HTTP method called when the menu item is selected.

     @name MenuItem#method
     @type {string}
     */
    this.method = props.method || null;

    /**
     The path called when the menu item is selected.

     @name MenuItem#path
     @type {string}
     */
    this.path = props.path || null;
}

/**
 * Creates a MenuItem from a SectionTag's child
 * @param {LiTag|BrTag|PTag|LabelTag|InputTag|string} tag
 * @returns {MenuItem}
 */
MenuItem.fromTag = function (tag) {
    let description,
        method,
        textSearch,
        path;

    if (typeof tag === 'string') {
        description = tag;
    } else {
        description = tag.toString();
    }

    if (!description) {
        // Ignore the menu items without text
        return undefined;
    }

    if (tag instanceof LiTag && tag.children[0] instanceof ATag) {
        const aTag = tag.children[0];
        method = aTag.attrs.method;
        path = aTag.attrs.href;
        textSearch = tag.attrs.textSearch;
    }

    return new MenuItem({
        description: description,
        textSearch: textSearch,
        method: method,
        path: path
    });
};

/**
 * Instantiates a Response object
 *
 * @class Response
 * @classdesc A Response object as defined in the JSON schema. It can be
 * built only from a top level object (Menu, Form).
 *
 * @param {Form|Menu} content - A {@link Menu} or a {@link Form} to
 * initialize the response with.
 */
function Response(content) {
    if (!content) {
        throw Error('content is mandatory');
    }

    let contentType;
    if (content instanceof Form) {
        contentType = 'form';
    } else if (content instanceof Menu) {
        contentType = 'menu';
    } else {
        throw Error(`Cannot create Response from ${content.constructor}`)
    }

    /**
     The type of the content of the response, either `"form"` or `"menu"`.

     @name Response#contentType
     @type {string}
     */
    this.contentType = contentType;

    /**
     The content of the response, either a {@link Form} or a {@link Menu}.

     @name Response#content
     @type {Form|Menu}
     */
    this.content = content;
}

/**
 * Creates a Response from a FormTag or SectionTag
 * @param {FormTag|SectionTag} tag
 * @returns {Response}
 */
Response.fromTag = function (tag) {
    if (tag instanceof FormTag) {
        return new Response(Form.fromTag(tag));
    } else if (tag instanceof SectionTag) {
        return new Response(Menu.fromTag(tag));
    } else {
        throw Error(`Cannot create response from ${tag.tagName} tag`)
    }
};

Response.prototype.toJSON = function () {
    return snakecase(this);
};


exports.Form = Form;
exports.Response = Response;
exports.Menu = Menu;
exports.MenuItem = MenuItem;
exports.MenuItemFormItem = MenuItemFormItem;
exports.FormItem = FormItem;
exports.FormMeta = FormMeta;
exports.MenuMeta = MenuMeta;
exports.MenuFormItemMeta = MenuFormItemMeta;

exports.parser = require('./parser');
exports.tags = require('./tag');
exports.config = require('./config');
