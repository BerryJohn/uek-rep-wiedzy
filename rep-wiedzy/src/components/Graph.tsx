import { useState, useMemo, useCallback, useEffect } from "react";
import ForceGraph3D from "react-force-graph-3d";
import * as THREE from "three";
import type { Binding } from "../api/query.types";
import { useRef } from "react";

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
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        border: "2px solid #D1D5DB", // Light gray border (Apple-like)
        borderRadius: "18px",
        background: "linear-gradient(135deg, #f5f6fa 0%, #e5e9f2 100%)", // Subtle Apple-like background
        boxShadow: "0 4px 24px 0 rgba(60,60,67,0.08)",
      }}
    >
      <ForceGraph3D
        width={dimensions.width}
        height={dimensions.height}
        nodeThreeObject={({ title, collapsed, childLinks }) => {
          const canvas = document.createElement("canvas");
          const fontSize = Math.max(16, Math.min(32, dimensions.width / 30));
          const padding = 24;
          const ctx = canvas.getContext("2d")!;
          ctx.font = `600 ${fontSize}px -apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif`;
          const textWidth = ctx.measureText(String(title)).width;
          canvas.width = Math.ceil(textWidth + padding * 2);
          canvas.height = Math.ceil(fontSize * 2 + padding);

          // Apple-like node colors
          if (!childLinks.length) {
            ctx.fillStyle = "#34C759"; // Apple green
          } else if (collapsed) {
            ctx.fillStyle = "#FF3B30"; // Apple red
          } else {
            ctx.fillStyle = "#FFD60A"; // Apple yellow
          }
          // Rounded rectangle background
          const radius = 16;
          ctx.beginPath();
          ctx.moveTo(radius, 0);
          ctx.lineTo(canvas.width - radius, 0);
          ctx.quadraticCurveTo(canvas.width, 0, canvas.width, radius);
          ctx.lineTo(canvas.width, canvas.height - radius);
          ctx.quadraticCurveTo(
            canvas.width,
            canvas.height,
            canvas.width - radius,
            canvas.height
          );
          ctx.lineTo(radius, canvas.height);
          ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - radius);
          ctx.lineTo(0, radius);
          ctx.quadraticCurveTo(0, 0, radius, 0);
          ctx.closePath();
          ctx.fill();

          // Border for node
          ctx.lineWidth = 3;
          ctx.strokeStyle = "#E5E5EA"; // Apple-like border color
          ctx.stroke();

          // Text styles
          ctx.font = `600 ${fontSize}px -apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif`;
          ctx.fillStyle = "#1C1C1E"; // Apple dark text
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(String(title), canvas.width / 2, canvas.height / 2);

          const sprite = new THREE.Sprite(
            new THREE.SpriteMaterial({
              map: new THREE.CanvasTexture(canvas),
              transparent: true,
            })
          );
          sprite.scale.set(canvas.width / 16, canvas.height / 16, 1);
          return sprite;
        }}
        graphData={prunedTree}
        linkDirectionalParticles={2}
        nodeColor={
          (node) =>
            !node.childLinks.length
              ? "#34C759" // Apple green
              : node.collapsed
              ? "#FF3B30" // Apple red
              : "#FFD60A" // Apple yellow
        }
        onNodeClick={(node: any) => {
          handlePublishedBooksCategoryClick(node.uri, node.title);
        }}
      />
    </div>
  );
};
