# MarkdownReader dizmo

The vanilla `MarkdownReader` dizmo is able to display a Markdown source (and if
provided with the corresponding CSS). Further for development purposes the back
side of the dizmo offers also an editor where temporary CSS can be edited (i.e.
styles specific *only* to that particular dizmo instance).

But once the content has been developed (and possibly a non-standard style has
been defined), we would like to *freeze* the configuration; for this purpose a
**new** GIT repository should be setup using the following instructions:

 1. Setup and clone your dedicated GIT repository for a particular content, e.g.
    for *frozen-book*:
    ```$ git clone ${FROZEN-BOOK-GIT-URL} frozen-book.git```

 2. Change to the newly cloned GIT repository: 
    ```$ cd frozen-book.git```

 3. Add the *MarkdownReader* GIT repository as a **submodule**:
    ```$ git submodule add ${MD-READER-GIT-URL} md-reader.git```

 4. Check the content of the *MarkdownReader* submodule repository:
    ```$ ls md-reader.git
    Icon-dark.svg  Preview.png     grace-md-reader-dizmo  project.cfg  test
    Icon.svg       dizmoInfo.json  manage.py              src
    ```

 5. Setup symbolic links from the *frozen-book* repository to the submodule:
    ```
    $ ln -s md-reader.git/manage.py    ## required
    $ ln -s md-reader.git/src          ## required
    $ ln -s md-reader.git/test         ## optional, recommended
    $ ln -s md-reader.git/Icon.svg     ## optional, not recommended
    $ ln -s md-reader.git/Preview.svg  ## optional, not recommended
    ```
    The first two symbolic links are mandatory; the 3rd link is recommended if
    you wish to run test cases (or if your build environment requires it). And
    if you need an icon but do not want to customize create the 4th link; same
    is true for the 5th link, the preview image.
  
 6. Copy the `md-reader.git/project.cfg` to your *frozen-book* repository and
    edit it to fix the `urlMd` and `urlCSS` path values:
    ```$ cp md-reader.git/project.cfg project.cfg```
 
 7. After editing the `project.cfg` configuration, it should look like:
    ```$ cat project.cfg
    {
        "name": "FrozenBook",
        "version": "0.1",
        "type": "md-reader-dizmo",
     // "deployment_path": "",
     // "zip_path": "",
     // "doc_path": "",
        "minify_js": true,
        "minify_css": true,
        "js_name": "application",
    
        "dizmo_settings": {
            "display_name": "Frozen Book",
            "description": "..",
            "tags": ["..", "markdown", "reader"],
            "category": "tools",
            "change_log": "..",
            "min_space_version": "1.0.713",
            "bundle_identifier": "com.dizmo.frozenbook",
            "bundle_name": "Frozen Book",
            "width": 500,
            "height": 500,
            "elements_version": "1.0",
            "box_inset_x": 0,
            "box_inset_y": 0,
            "api_version": "1.1",
            "main_html": "index.html"
        },
    
        "dizmo_private_store": {
            "urlMd": "http://help.dizmo.com/FrozenBook/en/index.md",
            "urlCss": "http://help.dizmo.com/FrozenBook/reader.css"
        }
    }```

    As you may have noticed the `showBack` and `showFront` configurations have
    been removed, since by default the settings (on the back side) are *not*
    shown. Further, you should of course make sure that the URLs exists and
    deliver the correct content.
    
    For `urlCss` you could also use the default base styles should you not have
    any custom style definitions, i.e. `http://help.dizmo.com/reader-base.css`.

 8. Now, you can threat the *FrozenBook* GIT repository like a regular dizmo
    GIT repository: Just execute things like `./manage.py zip` to create the
    DZM file etc. But of course for this to work you should ensure to have the
    `grace` (and also `grace-dizmo`) Python modules installed locally (either
    system wide or if you are familiar withing your `virtualenv` environment).

Handling submodules can sometimes be tricky: For further information about GIT
submodules, consult http://www.git-scm.com/book/en/Git-Tools-Submodules. It is
recommended to understand at least the basics of, to avoid mishaps!

Once you clone a GIT repository with submodules, don't forget to update (and
initialize) them via:

 ```$ git submodule update --init```

Since otherwise the folders of the submodules will remain emtpy!
