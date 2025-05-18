import { useState, useMemo, useCallback } from "react";
import ForceGraph3D from "react-force-graph-3d";
import * as THREE from "three";
import type { Binding } from "../api/query.types";

export function genRandomTree(N = 300, reverse = false) {
  return {
    nodes: [...Array(N).keys()].map((i) => ({ id: i })),
    links: [...Array(N).keys()]
      .filter((id) => id)
      .map((id) => ({
        [reverse ? "target" : "source"]: id,
        [reverse ? "source" : "target"]: Math.round(Math.random() * (id - 1)),
      })),
  };
}

// const graphData = genRandomTree(3, true);

export const generateGraphData = (books: Binding[]) => {
  const nodes: any = [{ id: 0, title: "MOST POPULAR BOOKS" }];
  const links: any = [];

  for (let i = 1; i < books.length; i++) {
    nodes.push({ id: i, title: books[i].categoryLabel.value });
  }

  for (let i = 1; i < books.length; i++) {
    links.push({ target: i, source: 0 });
  }

  return { nodes, links };
};

// const graphData = generateGraphData();

// const graphData = {
//   nodes: [
//     {
//       id: 0,
//     },
//     {
//       id: 1,
//     },
//     {
//       id: 2,
//     },
//   ],
//   links: [
//     {
//       target: 1,
//       source: 0,
//     },
//     {
//       target: 2,
//       source: 0,
//     },
//   ],
// };

export const Graph = ({ graphData }: any) => {
  const rootId = 0;

  console.log("graphData", graphData);

  const nodesById = useMemo(() => {
    const nodesById = Object.fromEntries(
      graphData.nodes.map((node: any) => [node.id, node])
    );

    // link parent/children
    graphData.nodes.forEach((node: any) => {
      node.collapsed = node.id !== rootId;
      node.childLinks = [];
    });
    graphData.links.forEach((link: any) =>
      nodesById[link.source].childLinks.push(link)
    );

    return nodesById;
  }, [graphData]);

  const getPrunedTree = useCallback(() => {
    const visibleNodes = [];
    const visibleLinks = [];
    (function traverseTree(node = nodesById[rootId]) {
      visibleNodes.push(node);
      if (node.collapsed) return;
      visibleLinks.push(...node.childLinks);
      node.childLinks
        .map((link: any) =>
          typeof link.target === "object" ? link.target : nodesById[link.target]
        ) // get child node
        .forEach(traverseTree);
    })();

    return { nodes: visibleNodes, links: visibleLinks };
  }, [nodesById]);

  const [prunedTree, setPrunedTree] = useState(getPrunedTree());

  const handleNodeClick = useCallback((node: any) => {
    node.collapsed = !node.collapsed; // toggle collapse state
    setPrunedTree(getPrunedTree());
  }, []);

  return (
    <ForceGraph3D
      nodeThreeObject={({ title }) => {
        const sprite = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: new THREE.CanvasTexture(
              (() => {
                console.log("title", title);
                const canvas = document.createElement("canvas");
                canvas.width = 512;
                canvas.height = 64;
                const ctx = canvas.getContext("2d")!;
                ctx.font = "24px Arial";
                ctx.fillStyle = "#fff";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";

                ctx.fillText(
                  String(title),
                  canvas.width / 2,
                  canvas.height / 2
                );
                return canvas;
              })()
            ),
            transparent: true,
          })
        );
        sprite.scale.set(8 * 3, 2 * 3, 1 * 3);
        return sprite;
      }}
      graphData={prunedTree}
      linkDirectionalParticles={2}
      nodeColor={(node) =>
        !node.childLinks.length ? "green" : node.collapsed ? "red" : "yellow"
      }
      onNodeClick={handleNodeClick}
    />
  );
};
