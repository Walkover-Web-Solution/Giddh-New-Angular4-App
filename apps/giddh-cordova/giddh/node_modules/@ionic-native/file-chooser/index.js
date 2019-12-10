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
import { IonicNativePlugin, cordova } from '@ionic-native/core';
var FileChooserOriginal = /** @class */ (function (_super) {
    __extends(FileChooserOriginal, _super);
    function FileChooserOriginal() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FileChooserOriginal.prototype.open = function (options) { return cordova(this, "open", {}, arguments); };
    FileChooserOriginal.pluginName = "FileChooser";
    FileChooserOriginal.plugin = "cordova-plugin-filechooser";
    FileChooserOriginal.pluginRef = "fileChooser";
    FileChooserOriginal.repo = "https://github.com/ihadeed/cordova-filechooser";
    FileChooserOriginal.platforms = ["Android"];
    return FileChooserOriginal;
}(IonicNativePlugin));
var FileChooser = new FileChooserOriginal();
export { FileChooser };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvQGlvbmljLW5hdGl2ZS9wbHVnaW5zL2ZpbGUtY2hvb3Nlci9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQ0EsT0FBTyw4QkFBc0MsTUFBTSxvQkFBb0IsQ0FBQzs7SUF1Q3ZDLCtCQUFpQjs7OztJQVFoRCwwQkFBSSxhQUFDLE9BQTRCOzs7Ozs7c0JBaERuQztFQXdDaUMsaUJBQWlCO1NBQXJDLFdBQVciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb3Jkb3ZhLCBJb25pY05hdGl2ZVBsdWdpbiwgUGx1Z2luIH0gZnJvbSAnQGlvbmljLW5hdGl2ZS9jb3JlJztcblxuZXhwb3J0IGludGVyZmFjZSBGaWxlQ2hvb3Nlck9wdGlvbnMge1xuICAgIC8qKlxuICAgICAqIGNvbW1hIHNlcGVyYXRlZCBtaW1lIHR5cGVzIHRvIGZpbHRlciBmaWxlcy5cbiAgICAgKi9cbiAgICBtaW1lOiBzdHJpbmc7XG59XG5cbi8qKlxuICogQG5hbWUgRmlsZSBDaG9vc2VyXG4gKiBAZGVzY3JpcHRpb25cbiAqXG4gKiBPcGVucyB0aGUgZmlsZSBwaWNrZXIgb24gQW5kcm9pZCBmb3IgdGhlIHVzZXIgdG8gc2VsZWN0IGEgZmlsZSwgcmV0dXJucyBhIGZpbGUgVVJJLlxuICpcbiAqIEB1c2FnZVxuICogYGBgdHlwZXNjcmlwdFxuICogaW1wb3J0IHsgRmlsZUNob29zZXIgfSBmcm9tICdAaW9uaWMtbmF0aXZlL2ZpbGUtY2hvb3Nlci9uZ3gnO1xuICpcbiAqIGNvbnN0cnVjdG9yKHByaXZhdGUgZmlsZUNob29zZXI6IEZpbGVDaG9vc2VyKSB7IH1cbiAqXG4gKiAuLi5cbiAqXG4gKiB0aGlzLmZpbGVDaG9vc2VyLm9wZW4oKVxuICogICAudGhlbih1cmkgPT4gY29uc29sZS5sb2codXJpKSlcbiAqICAgLmNhdGNoKGUgPT4gY29uc29sZS5sb2coZSkpO1xuICpcbiAqIGBgYFxuICogQGludGVyZmFjZXNcbiAqIEZpbGVDaG9vc2VyT3B0aW9uc1xuICovXG5AUGx1Z2luKHtcbiAgcGx1Z2luTmFtZTogJ0ZpbGVDaG9vc2VyJyxcbiAgcGx1Z2luOiAnY29yZG92YS1wbHVnaW4tZmlsZWNob29zZXInLFxuICBwbHVnaW5SZWY6ICdmaWxlQ2hvb3NlcicsXG4gIHJlcG86ICdodHRwczovL2dpdGh1Yi5jb20vaWhhZGVlZC9jb3Jkb3ZhLWZpbGVjaG9vc2VyJyxcbiAgcGxhdGZvcm1zOiBbJ0FuZHJvaWQnXVxufSlcbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBGaWxlQ2hvb3NlciBleHRlbmRzIElvbmljTmF0aXZlUGx1Z2luIHtcblxuICAvKipcbiAgICogT3BlbiBhIGZpbGVcbiAgICogQHBhcmFtIHtGaWxlQ2hvb3Nlck9wdGlvbnN9IFtvcHRpb25zXSAgT3B0aW9uYWwgcGFyYW1ldGVyLCBkZWZhdWx0cyB0byAnJy4gRmlsdGVycyB0aGUgZmlsZSBzZWxlY3Rpb24gbGlzdCBhY2NvcmRpbmcgdG8gbWltZSB0eXBlc1xuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxzdHJpbmc+fVxuICAgKi9cbiAgQENvcmRvdmEoKVxuICBvcGVuKG9wdGlvbnM/OiBGaWxlQ2hvb3Nlck9wdGlvbnMpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybjtcbiAgfVxuXG59XG4iXX0=