import { useState, useMemo, useCallback, useEffect } from "react";
import ForceGraph3D from "react-force-graph-3d";
import * as THREE from "three";
import type { Binding } from "../api/query.types";
import { useRef } from "react";

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

export const generateGraphData = (books: Binding[]) => {
  const nodes: any = [{ id: 0, title: "MOST POPULAR BOOKS" }];
  const links: any = [];

  for (let i = 1; i < books.length; i++) {
    nodes.push({
      id: i,
      title: books[i].categoryLabel.value,
      uri: books[i].category.value,
    });
  }

  for (let i = 1; i < books.length; i++) {
    links.push({ target: i, source: 0 });
  }

  return { nodes, links };
};

type GraphProps = {
  publishedCategoriesData: Binding[];
  handlePublishedBooksCategoryClick: (
    dbPediaLink: string,
    categoryName: string
  ) => void;
};

export const Graph: React.FC<GraphProps> = ({
  publishedCategoriesData,
  handlePublishedBooksCategoryClick,
}) => {
  const graphData = useMemo(
    () => generateGraphData(publishedCategoriesData),
    [publishedCategoriesData]
  );

  useEffect(() => {
    setPrunedTree(getPrunedTree());
  }, [graphData]);

  const rootId = 0;

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

  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function updateSize() {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      <ForceGraph3D
        width={dimensions.width}
        height={dimensions.height}
        nodeThreeObject={({ title }) => {
          const sprite = new THREE.Sprite(
            new THREE.SpriteMaterial({
              map: new THREE.CanvasTexture(
                (() => {
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
        onNodeClick={(node: any) => {
          handlePublishedBooksCategoryClick(node.uri, node.title);
        }}
      />
    </div>
  );
};
