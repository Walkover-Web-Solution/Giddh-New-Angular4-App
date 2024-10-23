# Setup Guide

1. Clone https://github.com/Walkover-Web-Solution/Giddh-New-Angular4-App.git.

2. This project requires Node version 14+, install Node from [here](https://nodejs.org/en/).

3. Go inside the cloned directory `Giddh-New-Angular4-App` in any terminal and run these following commands in the terminal to install dependency and start local serve.

4. Run `npm i` for installation of dependencies.

5. You need to add a ```.env``` file at the root of the project (similar to ```.env.example``` already present at the root) which is  used to store credentials related to Google, Razorpay. You can get the ```.env``` file from any of the contributors of this project.

5. Run `npm run start` to local serve the project.

# Contributing Guide

Before contributing it is required that you should have a proper knowledge of Git. If you're unfamiliar with Git you should first visit the recommended [Udacity Git course](https://blog.udacity.com/2015/06/a-beginners-git-github-tutorial.html).

Giddh has 4 environments `TEST`, `STAGE`, `BETA` and `PROD`. Any feature/bug needs to be deployed  first on `TEST` env. for testing, once the feature/bug is ready for production it needs to be deployed on rest of the higher environments. Below is the flow that any new feature/bug needs to cover in order for it to be marked as complete:

`feature/bug` --> `giddh-2.0` --> `beta-stage` --> `beta-branch` --> `production`

Branch `beta-stage` is considered to be the parent branch of all the new branches. This is the clean branch for development. **Every contributor is required to check out their new branch from this branch only for both feature & bug**.

**Feature F1 deployment cycle**:
1. Checkout a new branch named `<card-id>-stage` (where `<card-id>` needs to be replaced by Clickup card ID) from `beta-stage`. For eg: `dtqvbd-stage`
2. Complete your development on branch `dtqvbd-stage`
3. Proceed to deployment of `dtqvbd-stage` to `giddh-2.0` (TEST env.)
4. If conflicts occur follow below rules as per your scenario:
    1. If PR from `dtqvbd-stage` -> `giddh-2.0` has conflict -> Checkout a new branch `dtqvbd-test` from `giddh-2.0` and take a pull from `dtqvbd-stage` and resolve conflicts in branch `dtqvbd-test`; raise PR from `dtqvbd-test` to `giddh-2.0`
    2. If PR from `dtqvbd-stage` -> `beta-stage` has conflict -> Take a pull from `beta-stage` to branch `dtqvbd-stage` and resolve conflicts in it; raise PR from `dtqvbd-stage` -> `beta-stage`
    3. If PR from `beta-stage` -> `beta-branch` has conflict -> Checkout a new branch `dtqvbd-beta` from `beta-branch` and take a pull from `beta-stage`; raise PR from `dtqvbd-beta` to `beta-branch`
    4. If PR from `beta-branch` -> `production` has conflict -> Checkout a new branch `dtqvbd-prod` from `production` and take a pull from `beta-branch`; raise PR from `dtqvbd-prod` to `production`
    5. <u>**IN NO CASE YOUR BRANCH `dtqvbd-stage` SHOULD TAKE A PULL FROM `giddh-2.0` AND RESOLVING MERGE CONFLICTS DIRECTLY ON GITHUB IS STRICTLY PROHIBITED**</u>
5. Once PR is merged, provide your feature/bug on TEST env. for testing to tester
6. If issues are raised in testing: tester raises issue **I1** for developer; **F1** card is assigned back to the developer for issue fixing
7. **I1** issue should be fixed on `dtqvbd-stage` by developer:
        if branch `dtqvbd-stage` has conflict with `giddh-2.0` -> follow **Step 4.1** above
8. **I1** is tested and **F1** card is READY FOR PROD; raise PR from `dtqvbd-stage` -> `beta-stage`
9. Once `dtqvbd-stage` is merged to `beta-stage`, raise PR from `beta-stage` to `beta-branch` (follow **Step 4** above in case of merge conflicts)
10. Once `beta-stage` is merged to `beta-branch`, raise PR from  `beta-branch` to `production` (follow **Step 4** above in case of merge conflicts)

All of the changes **must be present on a single branch `<card-id>-stage`** which will act as a <u>**single source of truth**</u> for that feature/bug for other branches

`dtqvbd-stage` -> `beta-stage` -> `beta-branch` -> `production`

If you face any issues in the understanding of contributing guideline then please reach out to other contributors first than trying it out for yourself. If you have any suggestions for the improvement of this guideline then also you're welcome :)



# Desktop signing
For Giddh desktop builds, we support Windows and Mac platforms.
For signing Windows build:
1. You need to have the certificate in CER format. Usually, the certificates are available in CRT format. To convert from CRT to CER format follow below steps (use Windows system):
    - Double-click on the **yourwebsite.crt** file to open it into the certificate display.
    - Click on the **Details** tab, and then select the **Copy to file** button.
    - Click **Next** in the certificate wizard.
    - Choose **Base-64 encoded X.509 (.CER)**, and then click on **Next**.
    - Now, browse to store your file and type in the filename that you want to keep
    - Finally, save the file.
2. Once the CER format is obtained, convert this to PFX extension for it to be used in Electron builder variables. Command to run (use Windows system) for conversion:
```
openssl pkcs12 -export -in path/to/yourcertificate.cer -out desitnation/for/yourcertificate.pfx -nokeys
```
This command will ask for password, make sure you set a rememberable password.

3. Once the .pfx certificate is obtained, we need to update the Github Action secret variable `CSC_LINK_WIN` with its downloadable link. Upload the file on Google Drive, and get the downloadable link by pasting the G-Drive link (public link) on [direct link generator](http://www.syncwithtech.org/p/direct-download-link-generator.html). The link obtained from here should be set in `CSC_LINK_WIN`.
4. Set the variable `CSC_LINK_WIN_PASS` with the password that you've set in step 3.


# Angular Style Guide

This is a guide to Angular syntax, conventions, and application structure. This style guide presents preferred conventions to write scalable Angular Apps with syntax that is easy to read, understand, and navigate through.


**NOTE**: Most of it is inherited from  [Angular-Style Guide](https://angular.io/guide/styleguide).


## File/Folder Structure and Naming Conventions


1. Use consistent names for all files/symbols is a must.

2. Name your files/symbols following the convention of **feature.type.extension**.

3. File names must be separated with dots and dashes.

4.  **Feature and Folder Name** must describe the feature it is made for. It must be hyphenate/dash-case. For eg. if I had a Component named `StyleGuide`, my feature name would be `style-guide` and the folder in which this file resides would also be named `style-guide`.

5.  **File Type** must tell about the contents of the file. It can be any of the following:

`module` | `component` | `directive` | `pipe` | `service` | `model` | `class` | `interface` | `const` | `config` | `spec` | `e2e-spec`

6.  **File Extension** can be any of the following:

`ts` | `js` | `css` | `scss` | `json` | `map` | `ico` | `hbs` | `rules` | `md`

7. End to End test case files should be named like `app.e2e-spec.ts`

8. Class names must be in **PascalCase**/**UpperCamelCase**. So `app.component.ts` should have a file named `AppComponent`.

9. Consts should be declared in **UPPER_SNAKE_CASE**. So a const that contains configuration for your project may be named FIREBASE_CONFIG for eg.

10. Interfaces must be declared in **PascalCase**/**UpperCamelCase**. Interface names should not be prepended with an **I** as [TypeScript](https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines) guidelines discourage the **I** prefix. If there's an interface for machine, then it should be named as `Machine` for instance.

11. Observables should have a $ sign appended after their names so that they could be useful when scanning through code and looking for observable values. A variable named stopwatchValue that may contain an observable value may be named `stopwatchValue$` for instance.

12. Property and method names should be in **camelCase**.

13.  **Don't use _ before private** property or method names.

14.  **File Grouping** - Create a folder for a feature when it has multiple accompanying files (`.ts`, `.html`, `.scss` and `.spec`). Any entity or building block, that has multiple files for it, should reside in a folder of its own. For eg. if a Component named `StyleGuide` has a component class file(component), a template file(html), a style file(scss), and a test case file(spec), then all these 4 files must reside under the folder named `style-guide`.

15. Create a folder for an entity/feature if it has more than one files associated with it.

16. Create folders named for the feature area they represent.

17. Always use Angular CLI for all the file creation. This helps create files with the best and recommended conventions possible.

18. Name the feature module symbol reflecting the name of the feature area, folder, and file; for example, `app/cart/cart.module.ts` defines `CartModule`.



## Single Responsibility



Apply the [Single Responsibility Principle(SRP)](https://wikipedia.org/wiki/Single_responsibility_principle) to all components, services, and other symbols. This helps make the app cleaner, easier to read and maintain, and more testable. In order to do just that, keep the following points in mind:

1. Define just one thing per file. Thing here can either be class, style, tests, template etc. For eg. if a Component named StyleGuide needs to have a component class, a template file(html), some styles and tests, 4 different files should be created for each of the code type.

2. Files must not be more than **400 lines** of code. If a file exceeds 400 lines, break it into two separate blocks, thus creating two separate files.

3. A **file** must have a single responsibility. If you need to bootstrap an Angular App, define a model object, create a component and load data from the server for eg., create 4 files: a `main.ts` file to bootstrap the App, a `data.model.ts` file to define the model object, a `component-name.component.ts` file for defining the component, and a `data.service.ts` file to fetch data from the server. And it goes without saying that it will again follow the **File Grouping** rule.

4. Platform and Bootstrapping logic should be a part of `main.ts` file.

5. Application logic should reside in a Component or a Service.



### Single Responsibility for Functions



Just like files, functions also follow the single responsibility princinple. Define small functions. A function should be no more than **75 lines**.



## Misc



1. Variable declarations that aren't reassigned **must** be declared as const.

2. Interfaces should be used for Data Models instead of classes.

3. Leave one empty line between third party imports and application imports.

4. Import lines must always be listed in alphabetical order.

5. Destructured symbols must be arranged alphabetically.

6. Import symbols from their closest locations instead of importing everything from their parent module.



## App Structure and Modules



1. All of the app's code goes in a folder named `src`.

2. Keep related files near each other in an intuitive location. For eg. if you're building an e-commerce App, keep all files related to cart in a folder named cart.

3.  [Psychologists believe](https://en.wikipedia.org/wiki/The_Magical_Number_Seven,_Plus_or_Minus_Two) that humans start to struggle when the number of adjacent interesting things exceeds nine. So when a folder has ten or more files, it may be time to create subfolders. Create **sub-folders when a folder reaches seven or more files**.

4. Configure the IDE to hide distracting, irrelevant files such as generated `.js` and `.js.map` files.

5. Keep a flat folder structure as long as possible.

6. Try to be DRY (Don't Repeat Yourself). But **avoid** being so DRY that you sacrifice readability. For example, it's redundant to name a template `cart-view.component.html` because with the `.html` extension, it is obviously a view. But if something is not obvious or departs from a convention, then spell it out.





## Modules



1. Create an NgModule for each feature area.

2. All feature areas should be in their own folder, with their own NgModule.

3. Name the module the same as the folder it is placed in.

4. Create dedicated modules for cases like routing, using third party packages like Angular Material, Firebase etc.



### Shared Feature Module



1. Create a feature module named `SharedModule` in a `shared` folder; for example, `app/shared/shared.module.ts` defines `SharedModule`.

2. Declare components, directives, and pipes in a shared module when those items will be **re-used and referenced by the components declared in other feature modules**.

3. Use the name SharedModule when the contents of a shared module are **referenced across the entire application**.

4. Don't provide services in shared modules. Services are usually singletons that are provided once for the entire application or in a particular feature module. There are exceptions, however. A service that is stateless; that is, the consumers of the service aren't impacted by new instances can be declared in it.

5. Import all modules required by the assets in the `SharedModule`; for example, [`CommonModule`](https://angular.io/api/common/CommonModule) and [`FormsModule`](https://angular.io/api/forms/FormsModule).

6.  **Don't specify app-wide singleton providers** in a `SharedModule`. Intentional singletons are OK. Take care.



### Core Feature Module



1. Collect numerous, auxiliary, single-use classes inside a core module to simplify the apparent structure of a feature module.

2. Call the application-wide core module, `CoreModule`. Importing `CoreModule` into the root `AppModule` reduces its complexity and emphasizes its role as orchestrator of the application as a whole.

3. Create a feature module named `CoreModule` in a `core` folder (e.g. `app/core/core.module.ts`defines `CoreModule`).

4. Put **a singleton service whose instance will be shared throughout the application** in the `CoreModule` (e.g. `ExceptionService` and `LoggerService`).

5. Import all modules required by the assets in the `CoreModule` (e.g. [`CommonModule`](https://angular.io/api/common/CommonModule) and [`FormsModule`](https://angular.io/api/forms/FormsModule)).

6. Gather **application-wide, single use components** in the `CoreModule`. Import it once (in the `AppModule`) when the app starts and never import it anywhere else. (e.g. `NavComponent` and `SpinnerComponent`).

7.  **Don't import the `CoreModule` anywhere except in the `AppModule`.**

8. Export all symbols from the `CoreModule` that the `AppModule` will import and make available for other feature modules to use.

9.  `AppModule` is a little smaller because many app/root classes have moved to other modules. `AppModule` is stable because you will add future components and providers to other modules, not this one. `AppModule` delegates to imported modules rather than doing work. `AppModule` is focused on its main task, orchestrating the app as a whole.

10. Only the root `AppModule` should import the `CoreModule`. Guard against reimporting of `CoreModule` and fail fast by adding guard logic.

11. Put the contents of lazy loaded features in separate modules, in _lazy loaded folders_. A typical _lazy loaded folder_ contains a _routing component_, its child components, and their related assets and modules.

12. Don't allow modules in sibling and parent folders to directly import a module in a _lazy loaded feature_. Directly importing and using a module will load it immediately when the intention is to load it on demand.



## Component



1. Give components an **element** selector, as opposed to **attribute** or **class** selectors.

2. Extract templates and styles into their own files especially when the content of the files is more than 3 lines.

3. Always name the template file `[component-name].component.html`,

4. Always name the style file `[component-name].component.scss`

5. Specify _component-relative_ URLs, prefixed with `./`.

6. Use the [`@Input`](https://angular.io/api/core/Input) and [`@Output`](https://angular.io/api/core/Output) class decorators instead of the `inputs` and `outputs` properties of the [`@Directive`](https://angular.io/api/core/Directive) and [`@Component`](https://angular.io/api/core/Component) metadata.

7. Place [`@Input`](https://angular.io/api/core/Input) or [`@Output`](https://angular.io/api/core/Output) on the same line as the property it decorates.

8. Don't use **input** and **output** aliases except when it serves an important purpose.

9. Put presentation logic in the component class, and not in the template.

10. Don't prefix _output_  [properties](https://angular.io/guide/styleguide#dont-prefix-output-properties)

11. Name events without the prefix `on`.

12. Name event handler methods with the prefix `on` followed by the event name.

13. Limit logic in a component to only that required for the view. All other logic should be delegated to services.




### Component Selector Naming Conventions

1. Component element selectors should be in **dashed-case** or **kebab-case**. They should always be in lowercase. `admin-users` for eg.

2. Always use a **custom prefix for a component selector**. This can preferably be the module name itself. For example, the prefix `pb` represents **P**izza **B**uilder module and the prefix `cart` represents cart module. For eg. the preview component inside a cart module would have a selector of `cart-preview`.



## Class Member Sequences



1. Place properties up top followed by methods.

2. Place private members after public members, alphabetized.



## Directives



1. Use the [`@Input`](https://angular.io/api/core/Input) and [`@Output`](https://angular.io/api/core/Output) class decorators instead of the `inputs` and `outputs` properties of the [`@Directive`](https://angular.io/api/core/Directive) metadata.

2. Use an alias only when the directive name is also an **input** property, and the directive name doesn't describe the property.

3. Use attribute directives when you have presentation logic without a template.

4. Use the [`@HostListener`](https://angular.io/api/core/HostListener) and [`@HostBinding`](https://angular.io/api/core/HostBinding) to the [`host`](https://angular.io/api/core/Directive#host) property of the [`@Directive`](https://angular.io/api/core/Directive) and [`@Component`](https://angular.io/api/core/Component) decorators.

5. Use Renderer2 instead of ElementRef's NativeElement for DOM Manipulations.



### Directive Selector Naming Conventions



1. Always use **lowerCamelCase** for naming the selectors of directives.

2. Just like components, always use a custom prefix for the selector of directives. For eg. the form-validate directive in the cart module will have a selector of `cartFormValidate`.



## Services

1. Delegate complex component logic to [services](https://angular.io/guide/styleguide#delegate-complex-component-logic-to-services)

2. Move reusable logic to services and keep components simple and focused on their intended purpose.

3. Use services as singletons within the same injector. Use them for sharing data and functionality.

4. Create services with a single responsibility that is encapsulated by its context.

5. Create a new service once the service begins to exceed that singular purpose.

6. Provide a service with the app root injector in the [`@Injectable`](https://angular.io/api/core/Injectable) decorator of the service.

7. When two different components need different instances of a service provide the service at the component level.

8. Use the [`@Injectable`](https://angular.io/api/core/Injectable) class decorator instead of the [@Inject](https://angular.io/api/core/Inject) parameter decorator when using types as tokens for the dependencies of a service.

9. Logic for making data operations and interacting with data must reside inside a service.

10. Make data services responsible for XHR calls, local storage, stashing in memory, or any other data operations.

## Lifecycle Hooks

Implement the lifecycle hook interfaces. Don't just use methods without implementing the Lifecycle Hook Interfaces.

## Electron Build for Production

1. Checkout the production branch: git checkout production.
2. Pull the latest changes from the production branch: git pull origin production.
3. Update the version for the Angular package and the Electron Giddh package (e.g., if the current version is 8.2.15, increase the suffix from 15 to 16).
4. Run the Windows package build: npm run package:windows.
5. Check the Electron build in the electrongiddh-packages folder (e.g., look for a file like giddh Setup 8.2.20.exe).
6. Provide the build to the tester for sanity testing.
7. After the sanity check, upload the Electron build to the AWS S3 path (Coordinate with the lead for uploading the build to the AWS S3 path).

## Electron Build for Test

1. Checkout the production branch: git checkout giddh-2.0.
2. Pull the latest changes from the production branch: git pull origin giddh-2.0.
3. Update the version for the Angular package and the Electron Giddh package (e.g., if the current version is 8.2.15, increase the suffix from 15 to 16).
4. Run the Windows package build: npm run package:windows.
5. Check the Electron build in the electrongiddh-packages folder (e.g., look for a file like giddh Setup 8.2.20.exe).
6. Provide the build to the tester for sanity testing.
7. After the sanity check, upload the Electron build to the AWS S3 path (Coordinate with the lead for uploading the build to the AWS S3 path).

