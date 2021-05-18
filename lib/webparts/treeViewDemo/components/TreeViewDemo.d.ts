import * as React from 'react';
import { ITreeViewDemoProps } from './ITreeViewDemoProps';
import { ITreeViewDemoState } from './ITreeViewDemoState';
import "@pnp/sp/sites";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/files";
import "@pnp/sp/folders";
export default class TreeViewDemo extends React.Component<ITreeViewDemoProps, ITreeViewDemoState> {
    constructor(props: ITreeViewDemoProps);
    private _getLinks;
    render(): React.ReactElement<ITreeViewDemoProps>;
    private onTreeItemSelect;
    private onTreeItemExpandCollapse;
    private renderCustomTreeItem;
}
//# sourceMappingURL=TreeViewDemo.d.ts.map