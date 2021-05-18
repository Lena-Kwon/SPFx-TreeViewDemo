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
//var treearr: ITreeItem[] = [];
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
    /*
    private async _getLinks1() {
      const allItems: any[] = await sp.web.lists.getByTitle("TreeLinks").items.getAll();
      var treearr: ITreeItem[] = [];
      allItems.forEach(function (v, i) {
        if (v["ParentId"] == null) {
          const tree: ITreeItem = {
            key: v.Id,
            label: v["Title"],
            data: v["Link"],
            children: []
          }
          treearr.push(tree);
        }
        else {
          const tree: ITreeItem = {
            key: v.Id,
            label: v["Title"],
            data: v["Link"]
          }
          var treecol: Array<ITreeItem> = treearr.filter(function (value) { return value.key == v["ParentId"] })
          if (treecol.length != 0) {
            treecol[0].children.push(tree);
          }
        }
        console.log(v);
      });
      console.log(treearr);
      this.setState({ TreeLinks: treearr });
    }
    */
    TreeViewDemo.prototype._getLinks = function () {
        var _this = this;
        var treearr = [];
        //문서 라이브러리 목록 가져오기
        sp.web.lists.filter("BaseTemplate eq 101").orderBy('Title').get() //결과 : DocLibT, Documents...
            .then(function (lists) {
            lists.forEach(function (l) {
                sp.web.lists.getByTitle(l.Title).expand('RootFolder').select("Title, RootFolder/ServerRelativeUrl").get()
                    .then(function (folders) {
                    if (l.ItemCount > 0) {
                        var tree = {
                            key: folders.RootFolder.ServerRelativeUrl,
                            label: l.Title,
                            data: folders.RootFolder.ServerRelativeUrl,
                            children: []
                        };
                        treearr.push(tree);
                        console.log('트리에 push함(루트/하위있음)' + treearr.length + '/key=' + tree.key);
                    }
                    else {
                        var tree = {
                            key: folders.RootFolder.ServerRelativeUrl,
                            label: l.Title,
                            data: folders.RootFolder.ServerRelativeUrl
                        };
                        treearr.push(tree);
                        console.log('트리에 push함(루트/하위없음)' + treearr.length + '/key=' + tree.key);
                    }
                    console.log('Treearr length:' + treearr.length);
                    _this.setState({ TreeLinks: treearr });
                })
                    .catch(console.error.toString);
            }); //foreach
        })
            .catch(console.error.toString);
        //this.setState({ TreeLinks: treearr });       
    };
    TreeViewDemo.prototype.render = function () {
        console.log('render됨');
        return (React.createElement("div", { className: styles.treeViewDemo },
            React.createElement("div", { className: styles.container },
                React.createElement("div", { className: styles.row },
                    React.createElement("div", { className: styles.column },
                        React.createElement("span", { className: styles.title }, "[ DocumentLibrary Folder Tree ]"),
                        React.createElement(TreeView, { items: this.state.TreeLinks, defaultExpanded: false, selectionMode: TreeViewSelectionMode.None, selectChildrenIfParentSelected: true, showCheckboxes: false, expandToSelected: false, defaultExpandedChildren: false, treeItemActionsDisplayMode: TreeItemActionsDisplayMode.ContextualMenu, onSelect: this.onTreeItemSelect, onExpandCollapse: this.onTreeItemExpandCollapse, onRenderItem: this.renderCustomTreeItem }))))));
    };
    TreeViewDemo.prototype.componentWillReceiveProps = function (nextProps) {
        console.log("componentWillReceiveProps: " + JSON.stringify(nextProps));
    };
    TreeViewDemo.prototype.onTreeItemSelect = function (items) {
        console.log("Items selected: ", items);
    };
    TreeViewDemo.prototype.onTreeItemExpandCollapse = function (item, isExpanded) {
        console.log((isExpanded ? "Item 확장: " : "Item 축소: ") + item);
        if (isExpanded) {
            sp.web.getFolderByServerRelativeUrl(item.key).folders.filter("Name ne 'Forms'").get() //Folder A, Folder B
                .then(function (folders) {
                folders.forEach(function (f) {
                    if (f.ItemCount > 0) { //Folder A1, FolderA2
                        console.log(item.label + '^Child_하위 있음: ' + f.Name);
                        var tree_1 = {
                            key: f.ServerRelativeUrl,
                            label: f.Name,
                            data: f.ServerRelativeUrl,
                            children: []
                        };
                        var treecol = item.children.filter(function (value) { return value.key == tree_1.key; });
                        console.log('key 존재 여부: ' + treecol.length);
                        if (treecol.length == 0) {
                            console.log('부모트리에 child로 push함: ' + tree_1.label + '^' + tree_1.key);
                            item.children.push(tree_1);
                        }
                    }
                    else { //Folder B
                        //부모에 하위로 등록하고 끝내기 docLib의 자식으로 등록하면됨
                        console.log(item.label + '^Child_하위 없음: ' + f.Name);
                        var tree_2 = {
                            key: f.ServerRelativeUrl,
                            label: f.Name,
                            data: f.ServerRelativeUrl
                        };
                        //console.log('부모트리에 child로 push함: ' + tree.label + '^' + tree.key);
                        //item.children.push(tree);
                        var treecol = item.children.filter(function (value) { return value.key == tree_2.key; });
                        console.log('key 존재 여부: ' + treecol.length);
                        if (treecol.length == 0) {
                            console.log('부모트리에 child로 push함: ' + tree_2.label + '^' + tree_2.key);
                            item.children.push(tree_2);
                        }
                    }
                });
            })
                .catch(console.error);
        }
    };
    TreeViewDemo.prototype.renderCustomTreeItem = function (item) {
        return (React.createElement("span", null,
            React.createElement("a", { href: item.data, target: '_blank' }, item.label)));
    };
    return TreeViewDemo;
}(React.Component));
export default TreeViewDemo;
//# sourceMappingURL=bak.js.map