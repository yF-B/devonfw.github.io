function getParameters() {
    const searchParams = new URLSearchParams(document.location.hash.length > 0? document.location.hash.substring(1):"");
    var params = {};
    params.toString = () => searchParams.toString();
    params.set = (k,v) => searchParams.append(k,v);
    params.delete = (k,v) => {
        var allValues = searchParams.getAll(k);
        var newAllValues = allValues.filter(av => av != v);
        if(newAllValues.length != allValues.length){
            searchParams.delete(k);
            newAllValues.forEach(av => searchParams.set(k,av));
            return true;
        }
        return false; 
    }
    params.get = (k) => searchParams.getAll(k);
    params.keys = (k) => searchParams.keys(k);
    return params;
}

function search(){
    var parameters = getParameters();
    var solutions = solutionsJson;
    for (const filterName of parameters.keys()) {
        var filterValues = parameters.get(filterName);
        for(var i in filterValues){
            var filterValue = filterValues[i];
            var filterSolutions = tagsJson[filterName][filterValue];
            var newSolutions = {};
            for(var solutionKey in solutions){
                if(filterSolutions.includes(solutionKey)){
                    newSolutions[solutionKey] = solutions[solutionKey];
                }
            }
            solutions = newSolutions;
        }
    }
    //console.log(solutions);
    renderSolutions(solutions);
    highlightSelected();
}

function renderSolutions(solutions){
    var filterpanelbody = $("#resultspanel");
    filterpanelbody.empty();
    for (const solutionKey in solutions) {
        if (Object.hasOwnProperty.call(solutions, solutionKey)) {
            const solution = solutions[solutionKey];
            var solutionDiv = $('<div id="solution_' + solutionKey + '" class="solution"></div>');
            var solutionHeadlineDiv = $('<div id="solution_' + solutionKey + '_headline" class="solutionheadline"></div>');
            var solutionHeadlineLink = $('<a id="solution_' + solutionKey + '_headline_link" class="solutionheadlinelink" href="' + solution.path + '"></a>');
            solutionHeadlineLink.text(solution.headline);
            solutionHeadlineLink.attr('target','_blank')
            solutionHeadlineDiv.append(solutionHeadlineLink);
            solutionDiv.append(solutionHeadlineDiv);
            var solutionImage = $('<img id="solution_' + solutionKey + '_image" class="solutionimage" src="' + solution.image + '"></img>');
            solutionDiv.append(solutionImage);
            var solutionSnippetDiv = $('<div id="solution_' + solutionKey + '_snippet" class="solutionsnippet"></div>');
            solutionSnippetDiv.text(solution.snippet);
            solutionDiv.append(solutionSnippetDiv);
            filterpanelbody.append(solutionDiv);
        }
    }
}

function highlightSelected(){
    $(".tag.selected").removeClass("selected");
    var parameters = getParameters();
    for (const filterName of parameters.keys()) {
        var filterValues = parameters.get(filterName);
        for(var i in filterValues){
            var filterValue = filterValues[i];
            $("#tag_" + filterName+ '_' + filterValue.replace(/[^a-zA-Z0-9]/g,"_")).addClass("selected");
        }
    }
}

async function main() {
    indexJson = await $.ajax({
        url: "index.json"
    });

    solutionsJson = await $.ajax({
        url: "solutions.json"
    });

    tagsJson = await $.ajax({
        url: "tags.json"
    });

    var parameters = getParameters();

    var filterspanel = $('<div id="filterspanel" class="filterspanel"></div>');
    for (const filter in tagsJson) {
        if (Object.hasOwnProperty.call(tagsJson, filter)) {
            const tag = tagsJson[filter];
            console.log(tag);
            console.log('test');
            var filterpanel = $('<div id="filterpanel_' + filter + '" class="filterpanel"></div>');
            var filterpanelhead = $('<div id="filterpanel_' + filter + '_head" class="filterpanelhead"></div>');
            filterpanelhead.text(filter);
            filterpanel.append(filterpanelhead);
            var filterpanelbody = $('<div id="filterpanel_' + filter + '_body" class="filterpanelbody"></div>');
            filterpanel.append(filterpanelbody);
            for (const tagValue in tag) {
                if (Object.hasOwnProperty.call(tag, tagValue)) {
                    var tagDiv = $('<div class="tag" id="tag_' + filter+ '_' + tagValue.replace(/[^a-zA-Z0-9]/g,"_") +'"></div>');
                    tagDiv.text(tagValue);
                    tagDiv.click((e) => { 
                        if(!parameters.delete(filter, tagValue)){
                            parameters.set(filter, tagValue);
                        }
                        document.location.hash = "#" + parameters.toString()
                        search();
                     });
                    filterpanelbody.append(tagDiv);
                }
            }
            filterspanel.append(filterpanel);
        }
    }
    $("#content").append(filterspanel);
    var resultspanel = $('<div id="resultspanel" class="resultspanel"></div>');
    $("#content").append(resultspanel);
    search();
}

main();