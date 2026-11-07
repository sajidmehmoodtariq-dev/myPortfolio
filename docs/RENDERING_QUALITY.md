# Rendering quality

The full-viewport canvas now renders at native resolution on the tested 1440 × 900 and 1920 × 1080 desktop layouts. Portrait and high-DPI layouts use a pixel budget and a device-scale cap. Eight consecutive slow active frames can reduce supersampling toward CSS resolution. The normal Chrome sweeps did not activate this path.

The cover and chip markings use tightly fitted textures with anisotropic filtering capped at the hardware limit or 12×. This preserves lettering at shallow camera angles. The PGC-DHA display uses a 1536 × 947 texture, larger module labels, and a wider reading area. It remains labeled as a technical visualization without institutional records.

The rounded extrusions use an extra bevel segment and crease-aware normals to keep the long edges smooth. The ceramic uses a satin clearcoat, the chassis uses directional metallic highlights, and the internal layers retain a graphite seal, translucent glass, and restrained colored traces. The existing reflection bake and single soft shadow are retained. Key, fill, rim, exposure, and the shadow gradient were rebalanced to separate the ivory surfaces from the studio background.

The scene uses one WebGL context, one reflection bake, and one baked contact shadow. Existing material batches remain in place, and the display mesh is excluded from rendering while fully transparent. The soft shadow approximates grounding and there are no real-time shadow maps or transmission passes.
