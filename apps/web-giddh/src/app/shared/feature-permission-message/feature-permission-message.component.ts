import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";

/**
 * Centered empty state for features that are turned off / need a settings toggle.
 * Reusable across modules that deep-link users to a settings page.
 */
@Component({
    selector: "feature-permission-message",
    templateUrl: "./feature-permission-message.component.html",
    styleUrls: ["./feature-permission-message.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink, MatButtonModule]
})
export class FeaturePermissionMessageComponent {
    /** Main heading, e.g. "Delivery Challans are turned off" */
    readonly title = input.required<string>();
    /** Supporting copy; HTML allowed for bold setting names */
    readonly description = input<string>("");
    /** Primary CTA label */
    readonly primaryButtonText = input.required<string>();
    /** Router link for the primary CTA (path string or commands array) */
    readonly primaryButtonLink = input.required<string | string[]>();
    /** Optional secondary help link label */
    readonly secondaryLinkText = input<string>("");
    /** Optional secondary help URL (opens in a new tab) */
    readonly secondaryLinkUrl = input<string>("");
    /** Icomoon / icon class for the main illustration */
    readonly iconClass = input<string>("icon-invoice");
    /** Badge icon overlaid on the main icon (e.g. toggle off) */
    readonly badgeIconClass = input<string>("icon-switch-icon");
    /** When false, hides the badge overlay */
    readonly showBadge = input(true);
}
