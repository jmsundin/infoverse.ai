async function parseWikidata(data) {
    let bindings = data.results?.bindings;
    // console.log(bindings);
    if (bindings.length === 0) return null;
    let root = {
      parent: null,
      qid: bindings[0].object.value.substring(
        bindings[0].object.value.lastIndexOf("Q")
      ),
      label: bindings[0].objectLabel.value,
      description: bindings[0].objectDescription.value,
      uri: bindings[0].object.value,
      value: bindings.length - 1, // number of links / children
      children: [],
    };
  
    while (bindings.length > 0) {
      let currentNode = bindings.shift();
      if (currentNode !== undefined) {
        let {
          subject,
          subjectLabel,
          subjectDescription,
          predicateLabel,
          predicateEntity,
          predicateEntityIriLabel,
          object,
          objectLabel,
          objectDescription,
        } = currentNode;
  
        let newNode = {};
        let qid = subject.value.substring(subject.value.lastIndexOf("/") + 1);
  
        // check if node already exists
        // if not, create new node
        if (root.children.filter((node) => node.qid === qid).length === 0) {
          if (qid === subjectLabel.value) continue; // skip if the subject is the QID itself
          if (qid.length === 0) continue; // skip if the subject is not a QID
          newNode.qid = qid;
          newNode.parent = root.qid;
          newNode.label = subjectLabel.value;
          newNode.description =
            subjectDescription?.value || "No description available.";
          newNode.uri = subject.value;
          newNode.value = 1;
          newNode.predicateLabel = predicateLabel.value;
          newNode.predicateEntity = predicateEntity.value;
          newNode.predicateEntityIriLabel = predicateEntityIriLabel.value;
          newNode.children = [];
          root.children.push(newNode);
        }
      }
    }
    return root;
  }
  
  export { parseWikidata };  