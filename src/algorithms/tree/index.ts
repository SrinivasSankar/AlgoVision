import { treeNodes } from '@/data/structures';
import { TreeAlgorithmId, TreeStep } from '@/types';

const treeMap = new Map(treeNodes.map((node) => [node.id, node]));
const rootId = '8';

export const getTreeSteps = (algorithm: TreeAlgorithmId): TreeStep[] => {
  const steps: TreeStep[] = [];
  const visited: string[] = [];

  const visit = (id: string, line: number, message: string, frontier: string[] = []) => {
    visited.push(id);
    steps.push({
      type: 'visit',
      activeNode: id,
      visited: [...visited],
      frontier,
      message,
      line,
    });
  };

  const traverse = (id?: string) => {
    if (!id) return;
    const node = treeMap.get(id)!;
    if (algorithm === 'preorder') {
      visit(id, 1, `Preorder visits ${node.value} before either subtree.`);
      traverse(node.left);
      traverse(node.right);
      return;
    }
    if (algorithm === 'inorder') {
      traverse(node.left);
      visit(id, 2, `Inorder visits ${node.value} after the left subtree.`);
      traverse(node.right);
      return;
    }
    if (algorithm === 'postorder') {
      traverse(node.left);
      traverse(node.right);
      visit(id, 3, `Postorder visits ${node.value} after both children.`);
    }
  };

  if (algorithm === 'levelorder') {
    const queue = [rootId];
    steps.push({
      type: 'queue',
      activeNode: rootId,
      frontier: [rootId],
      visited: [],
      message: 'Level-order traversal starts by enqueueing the root.',
      line: 1,
    });
    while (queue.length > 0) {
      const current = queue.shift()!;
      const node = treeMap.get(current)!;
      visit(current, 3, `Visit ${node.value} in breadth-first order.`, [...queue]);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  } else {
    traverse(rootId);
  }

  steps.push({
    type: 'message',
    visited: [...visited],
    message: 'Traversal complete for the current tree order.',
    line: 0,
  });

  return steps;
};
