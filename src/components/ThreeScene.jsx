import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ThreeScene() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    try {
      const w = 600
      const h = 400

      const scene = new THREE.Scene()
      scene.background = new THREE.Color(0x2d6a4f)

      const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000)
      camera.position.z = 5

      const renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setSize(w, h)
      renderer.setPixelRatio(window.devicePixelRatio || 1)

      container.appendChild(renderer.domElement)

      // Crear 3 flores
      for (let i = 0; i < 3; i++) {
        const geo = new THREE.ConeGeometry(0.3, 1, 8)
        const mat = new THREE.MeshPhongMaterial({
          color: i === 0 ? 0xe8847f : i === 1 ? 0xd4a574 : 0xd4a574
        })
        const mesh = new THREE.Mesh(geo, mat)
        mesh.position.x = (i - 1) * 2
        mesh.userData.speed = 0.005 + Math.random() * 0.005
        scene.add(mesh)
      }

      const light1 = new THREE.PointLight(0xffffff, 1)
      light1.position.set(5, 5, 5)
      scene.add(light1)

      const light2 = new THREE.AmbientLight(0xffffff, 0.5)
      scene.add(light2)

      let animationId
      const animate = () => {
        animationId = requestAnimationFrame(animate)

        scene.children.forEach(child => {
          if (child.isMesh && child.userData.speed) {
            child.rotation.y += child.userData.speed
            child.position.y += Math.sin(Date.now() * 0.002) * 0.01
          }
        })

        renderer.render(scene, camera)
      }
      animate()

      return () => {
        cancelAnimationFrame(animationId)
        container.removeChild(renderer.domElement)
        renderer.dispose()
      }
    } catch (err) {
      console.error('Three.js error:', err)
    }
  }, [])

  return <div ref={containerRef} />
}
