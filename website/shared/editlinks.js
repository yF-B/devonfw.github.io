const editLinksModule = (function(window) {
  // Function definitions

  function executeRules(rules) {
    let result;
    let path = $("li").has(".sectlevel1").has(".toc-current").find("a").first().attr("href") || window.location.pathname;
    rules.some(rule => {
        let matches = rule.re.exec(path);
        if(matches){
            if(rule.index !== undefined){
                result = matches[rule.index];
            } else {
                result = rule.value;
            }
            return true;
        }
        return false;
    });

    return result;
  }

  function getRepoName() {

    let rules = [
        {
            re: /website\/pages\/welcome\/welcome\.html/,
            value: 'devonfw.github.io'
        },
        {
            re: /guide-([^\/]+?)\.asciidoc/,
            value: 'devonfw-guide'
        },
        {
            re: /master-contributing\.asciidoc/,
            value: '.github'
        },
        {
            re: /master-database\.asciidoc/,
            value: 'devonfw-guide'
        },
        {
            re: /devonfw-ide\.asciidoc/,
            value: 'ide'
        },
        {
            re: /(master-)?release-notes([^\/]+?)\.asciidoc/,
            value: undefined
        },
        {
            re: /User-Stories\.asciidoc/,
            value: undefined
        },
        {
            re: /dsf-how-to-use\.asciidoc/,
            value: undefined
        },
        {
            re: /(master-)?([^\/]+?)\.asciidoc/,
            index: 2
        }
    ];
    return executeRules(rules); 
  }

  function getFolderName() {

    let rules = [
        {
            re: /website\/pages\/welcome\/welcome\.html/,
            value: 'website/pages/welcome'
        },
        {
            re: /guide-([^\/]+?)\.asciidoc/,
            value: 'general/db'
        },
        {
            re: /master-contributing\.asciidoc/,
            value: ''
        },
        {
            re: /master-database\.asciidoc/,
            value: 'general/db'
        },
        {
            re: /devonfw-ide-([^\/]+?)\.asciidoc/,
            value: 'documentation'
        },
        {
            re: /(master-)?([^\/]+?)\.asciidoc/,
            value: 'documentation'
        }
    ];
    return executeRules(rules); 
  }

  function getBranchName() {

    let rules = [
        {
            re: /website\/pages\/welcome\/welcome\.html/,
            value: 'develop'
        },
        {
            re: /guide-([^\/]+?)\.asciidoc/,
            value: 'master'
        },
        {
            re: /master-contributing\.asciidoc/,
            value: 'master'
        },
        {
            re: /master-database\.asciidoc/,
            value: 'master'
        },
        {
            re: /devonfw-ide-([^\/]+?)\.asciidoc/,
            value: 'master'
        },
        {
            re: /master-cobigen\.asciidoc/,
            value: 'master'
        },
        {
            re: /master-production-line\.asciidoc/,
            value: 'master'
        },
        {
            re: /master-dashboard\.asciidoc/,
            value: 'develop'
        },
        {
            re: /master-mrchecker\.asciidoc/,
            value: 'develop'
        },
        {
            re: /(master-)?([^\/]+?)\.asciidoc/,
            value: 'master'
        }
    ];
    return executeRules(rules);
  }

  function getFilename(id) {

    let rules = [
        {
            re: /contributing.asciidoc_(.+?)/,
            value: 'CONTRIBUTING.asciidoc'
        },
        {
            re: /code_of_conduct.asciidoc_(.+?)/,
            value: 'CODE_OF_CONDUCT.asciidoc'
        },
        {
            re: /(^.+?)\.asciidoc/,
            index: 0
        },
    ];

    let result;
    rules.some(rule => {
        let matches = rule.re.exec(id);
        if (matches) {
            if (rule.index !== undefined) {
                result = matches[rule.index];
            } else {
                result = rule.value;
            }
            return true;
        }
        return false;
    });

    return result;
}

  function addEditLinks(alwaysVisible = true) {    
    let title = 'This will open the corresponding asciidoc file in the github editor and create a PullRequest for your changes when you save them. The changes will be reviewed before they are published on the website.';

    let repoName = getRepoName(); 

    if(repoName) {
        let folderName = getFolderName();
        let branchName = getBranchName();
        let urlPrefix = "https://github.com/devonfw/" + repoName + "/edit/" + branchName + "/" + folderName + "/";
        $('h3,h4,h5').each(function() {
            let headline = $( this );
            let id = headline.prop('id');
            let filename = getFilename(id);
            if(filename.length > 0) {
                if (filename.indexOf("_") != -1) {
                    if (filename != 'CODE_OF_CONDUCT.asciidoc') {
                        filename = filename.split("_");
                        filename = filename[filename.length - 1];
                    }
                }
                if (filename == 'oss-compliance.asciidoc') {
                    urlPrefix = "https://github.com/devonfw/devonfw-guide/edit/" + branchName + "/" + folderName + "general" + "/";
                }
                let url = urlPrefix + filename;
                let link = $('<a title="' + title + '" target="_blank" style="padding-left: 0.375em;" class="edit-link" href="' + url + '">&#x270E</a>');
                if(!alwaysVisible){
                    $("<style type='text/css'> .edit-link {   opacity: 0; }  *:hover > .edit-link, .edit-link:focus  {   opacity: 1; } </style>").appendTo("head");
                }
                let anchorLink = headline.find("a");
                if(anchorLink.length){
                    anchorLink.before(link);
                } else {
                    headline.append(link);
                }
            }
        });
    }

    let docsPage = /(^.+?)\/docs/;
    if(docsPage.test(window.location.pathname)){
      $(window).scroll(function () {
          let top = $('#toc').offset().top;
          let left = $('#toc').offset().left;
          let topOffset = parseInt(document.documentElement.scrollTop);
          let leftOffset = parseInt(document.documentElement.scrollLeft)
          let sidebarHeight = $('#toc').height();
          let pageHeight = $('#content').height();
          if ((top + topOffset + sidebarHeight) < pageHeight) {
              $('#toc').offset({ top: top + topOffset, left: left + leftOffset });
          }
      });
    }
  }

  // List of functions accessibly by other scripts
  return {
    addEditLinks: addEditLinks
  };
})(window);

export const EditLinksModule = editLinksModule;
