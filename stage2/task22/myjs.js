var nodeList=[];
var previousnode=null;

$(function () {
    $("#traversal").click(function () {
        nodeList=[];
        previousnode=null;
        searchTree($("#root"));
        doAnimation();
    });
});



function searchTree(root){
	searchNode(root);
	if (hasChild(root)) {
		searchTree($(root.children().get(0)));
		searchTree($(root.children().get(1)));
	}
}

function searchNode(node) {
	nodeList.push(node);


}

function hasChild(node){
	return node.children().length!==0;
}

function doAnimation(){
    var i= 0, node;
    iCount=setInterval(function(){
        node=nodeList[i];
        if (previousnode!==null) {
            previousnode.css("backgroundColor","white");
        }
        node.css("backgroundColor","tomato");
        previousnode=node;
        i++;
        if (i==nodeList.length){
            clearInterval(iCount);
            setTimeout(function(){previousnode.css("backgroundColor","white");},500)
        }
    },500);

}

