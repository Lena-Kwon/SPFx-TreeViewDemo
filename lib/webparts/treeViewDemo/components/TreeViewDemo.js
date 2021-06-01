var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import * as React from 'react';
import styles from './TreeViewDemo.module.scss';
import { TreeView, TreeViewSelectionMode, TreeItemActionsDisplayMode } from "@pnp/spfx-controls-react/lib/TreeView";
import { sp } from "@pnp/sp";
import "@pnp/sp/sites";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import { ServiceProvider } from '../services/ServiceProvider';
var TreeViewDemo = /** @class */ (function (_super) {
    __extends(TreeViewDemo, _super);
    function TreeViewDemo(props) {
        var _this = _super.call(this, props) || this;
        _this.onTreeItemExpandCollapse = _this.onTreeItemExpandCollapse.bind(_this);
        sp.setup({
            spfxContext: _this.props.context
        });
        _this.state = {
            TreeLinks: []
        };
        _this._getLinks();
        return _this;
    }
    TreeViewDemo.prototype._getLinks = function () {
        return __awaiter(this, void 0, void 0, function () {
            var dataProvider, treeArr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dataProvider = new ServiceProvider();
                        return [4 /*yield*/, dataProvider.GetRootFolders()];
                    case 1:
                        treeArr = _a.sent();
                        this.setState({ TreeLinks: treeArr });
                        return [2 /*return*/];
                }
            });
        });
    };
    TreeViewDemo.prototype.render = function () {
        console.log('render()' + this.state);
        return (React.createElement("div", { className: styles.treeViewDemo },
            React.createElement("div", { className: styles.container },
                React.createElement("div", { className: styles.row },
                    React.createElement("div", { className: styles.column },
                        React.createElement("span", { className: styles.title }, "[ DocumentLibrary Folder Tree ]"),
                        React.createElement(TreeView, { items: this.state.TreeLinks, defaultExpanded: false, selectionMode: TreeViewSelectionMode.None, selectChildrenIfParentSelected: true, showCheckboxes: false, expandToSelected: false, defaultExpandedChildren: false, treeItemActionsDisplayMode: TreeItemActionsDisplayMode.ContextualMenu, onSelect: this.onTreeItemSelect, onExpandCollapse: this.onTreeItemExpandCollapse, onRenderItem: this.renderCustomTreeItem }))))));
    };
    TreeViewDemo.prototype.onTreeItemSelect = function (items) {
        console.log("Items selected: ", items);
    };
    TreeViewDemo.prototype.onTreeItemExpandCollapse = function (item, isExpanded) {
        return __awaiter(this, void 0, void 0, function () {
            var dataProvider, treeItem;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!isExpanded) return [3 /*break*/, 2];
                        dataProvider = new ServiceProvider();
                        return [4 /*yield*/, dataProvider.GetSubFolders(item)];
                    case 1:
                        treeItem = _a.sent();
                        this.setState({ TreeLinks: this.state.TreeLinks });
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    TreeViewDemo.prototype.renderCustomTreeItem = function (item) {
        return (React.createElement("span", null,
            React.createElement("a", { href: item.data, target: '_blank' }, item.label)));
    };
    return TreeViewDemo;
}(React.Component));
export default TreeViewDemo;
//# sourceMappingURL=TreeViewDemo.js.map