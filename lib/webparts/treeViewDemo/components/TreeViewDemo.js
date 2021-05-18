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
var TreeViewDemo = /** @class */ (function (_super) {
    __extends(TreeViewDemo, _super);
    function TreeViewDemo(props) {
        var _this = _super.call(this, props) || this;
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
            var treearr;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        treearr = [];
                        //문서 라이브러리 목록 가져오기
                        return [4 /*yield*/, sp.web.lists.filter("BaseTemplate eq 101").expand('RootFolder').orderBy('Created').get() //결과 : DocLibT, Documents...
                                .then(function (librarys) {
                                librarys.forEach(function (l) { return __awaiter(_this, void 0, void 0, function () {
                                    var _this = this;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: 
                                            //문서 라이브러리에 서브폴더가 있는지 조회
                                            return [4 /*yield*/, sp.web.getFolderById(l.RootFolder.UniqueId).folders.filter("Name ne 'Forms' and ProgID ne 'OneNote.Notebook'").orderBy('Name').select('Title').get()
                                                    .then(function (folders) {
                                                    if (folders.length > 0) {
                                                        var tree = {
                                                            key: l.RootFolder.ServerRelativeUrl,
                                                            label: l.Title,
                                                            data: l.RootFolder.ServerRelativeUrl,
                                                            children: []
                                                        };
                                                        treearr.push(tree);
                                                        //console.log('트리에 push함(루트/하위있음)'  + treearr.length + '/key=' + tree.key);
                                                    }
                                                    else {
                                                        var tree = {
                                                            key: l.RootFolder.ServerRelativeUrl,
                                                            label: l.Title,
                                                            data: l.RootFolder.ServerRelativeUrl
                                                        };
                                                        treearr.push(tree);
                                                        //console.log('트리에 push함(루트/하위없음)' + treearr.length + '/key=' + tree.key);
                                                    }
                                                    console.log('Treearr length:' + treearr.length);
                                                    _this.setState({ TreeLinks: treearr });
                                                })
                                                    .catch(console.error.toString)];
                                            case 1:
                                                //문서 라이브러리에 서브폴더가 있는지 조회
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); }); //foreach
                            })
                                .catch(console.error.toString)];
                    case 1:
                        //문서 라이브러리 목록 가져오기
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    TreeViewDemo.prototype.render = function () {
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
    /*
    private onTreeItemExpandCollapse(item: ITreeItem, isExpanded: boolean) {
      console.log((isExpanded ? "Item 확장: " : "Item 축소: ") + item);
      
      if (isExpanded) {
        sp.web.getFolderByServerRelativeUrl(item.key).folders.filter(`Name ne 'Forms' and ProgID ne 'OneNote.Notebook'`).orderBy('Name').get()
          .then((folders: IFolderInfo[]) => {
            folders.forEach(f => {
              if (f.ItemCount > 0) {
                //console.log(item.label + '^Child_하위 있음: ' + f.Name);
                const tree: ITreeItem = {
                  key: f.ServerRelativeUrl,
                  label: f.Name,
                  data: f.ServerRelativeUrl,
                  children: []
                };
  
                const treecol: Array<ITreeItem> = item.children.filter((value) => { return value.key == tree.key; });
                if (treecol.length == 0) {
                  item.children.push(tree);
                  console.log('부모트리에 child로 push함(하위있음): ' + tree.label + '^' + tree.key);
                }
              }
              else {
                //console.log(item.label + '^Child_하위 없음: ' + f.Name);
                const tree: ITreeItem = {
                  key: f.ServerRelativeUrl,
                  label: f.Name,
                  data: f.ServerRelativeUrl
                };
  
                const treecol: Array<ITreeItem> = item.children.filter((value) => { return value.key == tree.key; });
                if (treecol.length == 0) {
                  item.children.push(tree);
                  console.log('부모트리에 child로 push함: ' + tree.label + '^' + tree.key);
                }
              }
  
            });
          })
          .catch(console.error);
      }
    }
    */
    TreeViewDemo.prototype.onTreeItemExpandCollapse = function (item, isExpanded) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!isExpanded) return [3 /*break*/, 2];
                        return [4 /*yield*/, sp.web.getFolderByServerRelativeUrl(item.key).folders.filter("Name ne 'Forms' and ProgID ne 'OneNote.Notebook'").orderBy('Name').get()
                                .then(function (librarys) {
                                librarys.forEach(function (l) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, sp.web.getFolderByServerRelativeUrl(l.ServerRelativeUrl).folders.filter("Name ne 'Forms' and ProgID ne 'OneNote.Notebook'").orderBy('Name').get()
                                                    .then(function (folders) {
                                                    if (folders.length > 0) {
                                                        var tree_1 = {
                                                            key: l.ServerRelativeUrl,
                                                            label: l.Name,
                                                            data: l.ServerRelativeUrl,
                                                            children: []
                                                        };
                                                        var treecol = item.children.filter(function (value) { return value.key == tree_1.key; });
                                                        if (treecol.length == 0) {
                                                            item.children.push(tree_1);
                                                            //console.log('부모트리에 child로 push함(하위있음): ' + tree.label + '^' + tree.key);
                                                        }
                                                    }
                                                    else {
                                                        var tree_2 = {
                                                            key: l.ServerRelativeUrl,
                                                            label: l.Name,
                                                            data: l.ServerRelativeUrl
                                                        };
                                                        var treecol = item.children.filter(function (value) { return value.key == tree_2.key; });
                                                        if (treecol.length == 0) {
                                                            item.children.push(tree_2);
                                                            //console.log('부모트리에 child로 push함: ' + tree.label + '^' + tree.key);
                                                        }
                                                    }
                                                })
                                                    .catch(console.error.toString)];
                                            case 1:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); }); //foreach 
                            })
                                .catch(console.error)];
                    case 1:
                        _a.sent();
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