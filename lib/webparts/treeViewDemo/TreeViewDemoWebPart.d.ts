import { Version } from '@microsoft/sp-core-library';
import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
export interface ITreeViewDemoWebPartProps {
    description: string;
}
export default class TreeViewDemoWebPart extends BaseClientSideWebPart<ITreeViewDemoWebPartProps> {
    render(): void;
    protected onDispose(): void;
    protected readonly dataVersion: Version;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
}
//# sourceMappingURL=TreeViewDemoWebPart.d.ts.map