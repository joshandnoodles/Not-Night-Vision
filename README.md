## Objective

Using a PIC microcontroller and a non-contact infrared thermometer, MLX90614, an extremely low-cost thermal imaging system can be realized at a price point where thermal imaging data will be able to supplement and potentially replace traditional imaging solutions. The small, low cost MLX90614’s high precision measurements along with its narrow field of view (5&deg;) allow for cheap thermal data at a resolution that was previously unimaginable. Existing thermal imaging concepts using this sensor have already seen success[^ir_eye] [^arduino_ex]. However, the benefits of this sensor can be further exploited by using the following devices: mirrors to reduce vibrations and increase tracking speed, optics/diaphragm to precisely change pixel size for objects of varying size or varying distances, sampling and interpolation techniques, and low-level software changes to enhance sensor’s data collection. 

[^ir_eye]: http://spectrum.ieee.org/geek-life/hands-on/ir-eye

[^arduino_ex]: http://community.wolfram.com/groups/-/m/t/246929

[^pic_prod_list]: http://www.microchip.com/ParamChartSearch/Chart.aspx?branchID=8187

[^mlx_prod]: http://www.melexis.com/Infrared-Thermometer-Sensors/Infrared-Thermometer-Sensors/MLX90614-615.aspx

## Evaluation

At the conclusion of the project, success will be determined based on the system’s ability to complete the following tasks:

1. Reconstruct a 64-pixel image of a glass of heated water placed 10 meters away 
	- Temperature accuracy of +/1&deg;F
	- Image capture time <= 60 sec
2. Track a designated person moving at walking speed in a room maintaining tracking on that person even with other non-moving people in the room
	- *This will not necessarily be completed on the similar timeline as Task 1. It is an extra evaluation standard most likely meant for future time.*

## Project Needs

Hardware, tools, supplies anticipated for project:
- PIC microcontroller  with I2C capabilities to connect with IR sensor
- MLX90614 sensor 
- Soldering tools
- Custom PCB (additional components for standalone system to be determined)

## Team Roster

Joshua Alexander – Hardware/Software 
[id]: https://www.dropbox.com/s/68cuoj26z9y5twk/thermal_img_man.png?raw=1 "Figure 1: never "
