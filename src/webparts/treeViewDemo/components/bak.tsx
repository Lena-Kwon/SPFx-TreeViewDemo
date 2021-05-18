import * as React from 'react';
import styles from './TreeViewDemo.module.scss';
import { ITreeViewDemoProps } from './ITreeViewDemoProps';
import { ITreeViewDemoState } from './ITreeViewDemoState';

import { useState } from 'react';
import { TreeView, ITreeItem, TreeViewSelectionMode, TreeItemActionsDisplayMode } from "@pnp/spfx-controls-react/lib/TreeView";
import { sp } from "@pnp/sp";
import "@pnp/sp/sites";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/files";
import "@pnp/sp/folders";

import { IFolderInfo, IListInfo } from "@pnp/sp/presets/all";
import { IList, ILists } from "@pnp/sp/lists";
import { IContextInfo, IDocumentLibraryInformation } from "@pnp/sp/sites";
import { IFolders, Folders } from "@pnp/sp/folders";

//var treearr: ITreeItem[] = [];
export default class TreeViewDemo extends React.Component<ITreeViewDemoProps, ITreeViewDemoState> {
  constructor(props: ITreeViewDemoProps) {
    super(props);
    sp.setup({
      spfxContext: this.props.context
    });
    this.state = {
      TreeLinks: []
    };
    this._getLinks();
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

  private _getLinks() {
    var treearr: ITreeItem[] = [];
    //문서 라이브러리 목록 가져오기
    sp.web.lists.filter(`BaseTemplate eq 101`).orderBy('Title').get() //결과 : DocLibT, Documents...
      .then((lists: IListInfo[]) => {
        lists.forEach(l => {
          sp.web.lists.getByTitle(l.Title).expand('RootFolder').select("Title, RootFolder/ServerRelativeUrl").get()
            .then((folders) => {
              if (l.ItemCount > 0) {
                const tree: ITreeItem = {
                  key: folders.RootFolder.ServerRelativeUrl,
                  label: l.Title,
                  data: folders.RootFolder.ServerRelativeUrl,
                  children: []
                };
                treearr.push(tree);
                console.log('트리에 push함(루트/하위있음)'  + treearr.length + '/key=' + tree.key);
              }
              else {
                const tree: ITreeItem = {
                  key: folders.RootFolder.ServerRelativeUrl,
                  label: l.Title,
                  data: folders.RootFolder.ServerRelativeUrl
                };

                treearr.push(tree);
                console.log('트리에 push함(루트/하위없음)' + treearr.length + '/key=' + tree.key);
              }
              
              console.log('Treearr length:' + treearr.length);
              this.setState({ TreeLinks: treearr });       
            })
            .catch(console.error.toString);
        }); //foreach
      })
      .catch(console.error.toString);

      //this.setState({ TreeLinks: treearr });       
  }


  public render(): React.ReactElement<ITreeViewDemoProps> {
    console.log('render됨');
    return (
      <div className={styles.treeViewDemo}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <span className={styles.title}>[ DocumentLibrary Folder Tree ]</span>

              <TreeView
                items={this.state.TreeLinks}
                defaultExpanded={false}
                selectionMode={TreeViewSelectionMode.None}
                selectChildrenIfParentSelected={true}
                showCheckboxes={false}
                expandToSelected={false}
                defaultExpandedChildren={false}
                treeItemActionsDisplayMode={TreeItemActionsDisplayMode.ContextualMenu}
                onSelect={this.onTreeItemSelect}
                onExpandCollapse={this.onTreeItemExpandCollapse}
                onRenderItem={this.renderCustomTreeItem} />

            </div>
          </div>
        </div>
      </div>
    );
  }

  public componentWillReceiveProps(nextProps){
    console.log("componentWillReceiveProps: " + JSON.stringify(nextProps));
  }

  private onTreeItemSelect(items: ITreeItem[]) {
    console.log("Items selected: ", items);
  }

  private onTreeItemExpandCollapse(item: ITreeItem, isExpanded: boolean) {
    console.log((isExpanded ? "Item 확장: " : "Item 축소: ") + item);
    
    if (isExpanded) {
      sp.web.getFolderByServerRelativeUrl(item.key).folders.filter(`Name ne 'Forms'`).get() //Folder A, Folder B
        .then((folders: IFolderInfo[]) => {
          folders.forEach(f => {
            if (f.ItemCount > 0) { //Folder A1, FolderA2
              console.log(item.label + '^Child_하위 있음: ' + f.Name);
              
              const tree: ITreeItem = {
                key: f.ServerRelativeUrl,
                label: f.Name,
                data: f.ServerRelativeUrl,
                children: []
              };

              const treecol: Array<ITreeItem> = item.children.filter((value) => { return value.key == tree.key; });
              console.log('key 존재 여부: ' + treecol.length);
              if (treecol.length == 0) {
                console.log('부모트리에 child로 push함: ' + tree.label + '^' + tree.key);
                item.children.push(tree);
              }
            }
            else { //Folder B
              //부모에 하위로 등록하고 끝내기 docLib의 자식으로 등록하면됨
              console.log(item.label + '^Child_하위 없음: ' + f.Name);
              const tree: ITreeItem = {
                key: f.ServerRelativeUrl,
                label: f.Name,
                data: f.ServerRelativeUrl
              };

              //console.log('부모트리에 child로 push함: ' + tree.label + '^' + tree.key);
              //item.children.push(tree);
              const treecol: Array<ITreeItem> = item.children.filter((value) => { return value.key == tree.key; });
              console.log('key 존재 여부: ' + treecol.length);
              if (treecol.length == 0) {
                console.log('부모트리에 child로 push함: ' + tree.label + '^' + tree.key);
                item.children.push(tree);
              }
            }
          });
        })
        .catch(console.error);
    }
  }

  private renderCustomTreeItem(item: ITreeItem): JSX.Element {
    return (
      <span>
        <a href={item.data} target={'_blank'}>
          {item.label}
        </a>
      </span>
    );
  }
}
