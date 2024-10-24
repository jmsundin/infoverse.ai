export function mergeSubgraph(
  newRoot,
  newNodes,
  newLinks,
  previousRoot,
  previousNodes
) {
  const previousNodeIds = new Set(previousNodes.map((n) => n.data.qid));
  const uniqueNewNodes = newNodes.filter(
    (n) => !previousNodeIds.has(n.data.qid)
  );

  const mergedNodes = previousNodes.map((node) => {
    // Find any new child nodes for this node
    const newChildren = uniqueNewNodes.filter(
      (n) => n.parent.data.qid === node.data.qid
    );

    // Add the new child nodes
    node.children = [...(node.children || []), ...newChildren];
    node.data.children = [...(node.data.children || []), ...newChildren];

    return node;
  });

  // Merge the links
  const mergedLinks = [...previousLinks, ...newLinks];

  return {
    nodes: mergedNodes,
    links: mergedLinks,
  };
}
