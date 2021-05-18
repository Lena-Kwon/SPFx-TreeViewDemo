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
  
  private async _getLinks() {
    var treearr: ITreeItem[] = [];
    //문서 라이브러리 목록 가져오기
    await sp.web.lists.filter(`BaseTemplate eq 101`).expand('RootFolder').orderBy('Created').get() //결과 : DocLibT, Documents...
      .then((librarys: IListInfo[]) => {
        librarys.forEach(async l => {

          //문서 라이브러리에 서브폴더가 있는지 조회
          await sp.web.getFolderById(l.RootFolder.UniqueId).folders.filter(`Name ne 'Forms' and ProgID ne 'OneNote.Notebook'`).orderBy('Name').select('Title').get()
            .then((folders) => {
              if (folders.length > 0) {
                const tree: ITreeItem = {
                  key: l.RootFolder.ServerRelativeUrl,
                  label: l.Title,
                  data: l.RootFolder.ServerRelativeUrl,
                  children: []
                };
                treearr.push(tree);
                //console.log('트리에 push함(루트/하위있음)'  + treearr.length + '/key=' + tree.key);
              }
              else {
                const tree: ITreeItem = {
                  key: l.RootFolder.ServerRelativeUrl,
                  label: l.Title,
                  data: l.RootFolder.ServerRelativeUrl
                };

                treearr.push(tree);
                //console.log('트리에 push함(루트/하위없음)' + treearr.length + '/key=' + tree.key);
              }

              console.log('Treearr length:' + treearr.length);
              this.setState({ TreeLinks: treearr });       
            })
            .catch(console.error.toString);
        }); //foreach
      })
      .catch(console.error.toString);
  }


  public render(): React.ReactElement<ITreeViewDemoProps> {
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

  private onTreeItemSelect(items: ITreeItem[]) {
    console.log("Items selected: ", items);
  }

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

  private async onTreeItemExpandCollapse(item: ITreeItem, isExpanded: boolean) {
    //console.log((isExpanded ? "Item 확장: " : "Item 축소: ") + item);
    
    if (isExpanded) {
      await sp.web.getFolderByServerRelativeUrl(item.key).folders.filter(`Name ne 'Forms' and ProgID ne 'OneNote.Notebook'`).orderBy('Name').get()
        .then((librarys: IFolderInfo[]) => {
          librarys.forEach(async l => {

            await sp.web.getFolderByServerRelativeUrl(l.ServerRelativeUrl).folders.filter(`Name ne 'Forms' and ProgID ne 'OneNote.Notebook'`).orderBy('Name').get()
            .then((folders) => {
              if (folders.length > 0) {
                const tree: ITreeItem = {
                  key: l.ServerRelativeUrl,
                  label: l.Name,
                  data: l.ServerRelativeUrl,
                  children: []
                };

                const treecol: Array<ITreeItem> = item.children.filter((value) => { return value.key == tree.key; });
                if (treecol.length == 0) {
                  item.children.push(tree);
                  //console.log('부모트리에 child로 push함(하위있음): ' + tree.label + '^' + tree.key);
                }
              }
              else {
                const tree: ITreeItem = {
                  key: l.ServerRelativeUrl,
                  label: l.Name,
                  data: l.ServerRelativeUrl
                };

                const treecol: Array<ITreeItem> = item.children.filter((value) => { return value.key == tree.key; });
                if (treecol.length == 0) {
                  item.children.push(tree);
                  //console.log('부모트리에 child로 push함: ' + tree.label + '^' + tree.key);
                }
              } 
            })
            .catch(console.error.toString);
          }); //foreach 
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
