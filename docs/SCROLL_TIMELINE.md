# Scroll timeline

The track covers 240 small viewport heights, with a 1,500 px minimum for short viewports. Progress is normalized to 0–1. Chapter links seek to 0%, 50%, and 96%.

| Progress | Object and text | Camera |
| --- | --- | --- |
| 0–20% | Cartridge rotates subtly, scales from .93 to 1.02, and the arrival copy settles into position. | Azimuth .73 → .55 rad, elevation .48 → .57 rad, nominal radius 10.8 → 9.8 units. |
| 20–55% | Cover lifts. The glass advances toward the camera. Bezel, board, chassis, and base separate with distinct rotations. The arrival copy wipes away and the technical index opens. | Azimuth approaches .29 rad and elevation .28 rad. The camera lowers and reframes the expanded stack. |
| 55–80% | The assembly pitches toward vertical. The cover clears the rear edge, crosses the stack axis, and starts sliding into the rear seat. The other layers return to their mounts and the optical layer grows to full aperture. | Camera pulls back while the cover travels, aiming farther back and higher. The frame then moves toward a frontal view. |
| 80–100% | Project copy wipes in. The cover finishes docking at 83.5%, the display surface reaches full opacity at 93.5%, and the finished configuration holds after 94%. | Azimuth settles at .09 rad and elevation .035 rad, with a nominal radius of 9.5 and a target of [.035, .10, −.07]. |

The cover begins its rearward slide at 50.5%. It travels −3.39 along local Z before crossing local Y toward its rear seat at −.91. The bezel and PCB complete their local rotations before final presentation. The base extends .19 along local Z to form the lower support lip once upright.

The camera uses animated azimuth, elevation, radius, target, and screen offsets. A projection fit widens the view when the stack or cover needs extra space. Portrait framing recomputes the distance against the narrower screen and reduces local explosion travel. Diagnostic positions reflect the actual camera after these calculations.

The project headline begins wiping in at 75.5% to lead the optical reveal, which begins at 78%. Each timeline sample is derived from scroll position. The text masks and device pose hold when scrolling stops and retrace the same values in reverse.
