# Proposal

## Objective

Using a PIC microcontroller and a non-contact infrared thermometer, MLX90614, an extremely low-cost thermal imaging system can be realized at a price point where thermal imaging data will be able to supplement and potentially replace traditional imaging solutions. The small, low cost MLX90614's high precision measurements along with its narrow field of view (5&deg;) allow for cheap thermal data at a resolution that was previously unimaginable. Existing thermal imaging concepts using this sensor have already seen success[^IR-Eye]&nbsp;[^Arduino-Example]. However, the benefits of this sensor can be further exploited by using the following devices: mirrors to reduce vibrations and increase tracking speed, optics/diaphragm to precisely change pixel size for objects of varying size or varying distances, sampling and interpolation techniques, and low-level software changes to enhance sensor’s data collection. 

[^IR-Eye]: http://spectrum.ieee.org/geek-life/hands-on/ir-eye

[^Arduino-Example]: http://community.wolfram.com/groups/-/m/t/246929


## Evaluation

At the conclusion of the project, success will be determined based on the system’s ability to complete the following tasks:

1. Reconstruct a 64-pixel image of a glass of heated water placed 10 meters away 
	- Temperature accuracy of +/1&deg;F
	- Image capture time <= 60 sec
2. Track a designated person moving at walking speed in a room maintaining tracking on that person even with other non-moving people in the room
	- *This will not necessarily be completed on the similar timeline as Task 1. It is an extra evaluation standard most likely meant for future time.*

![Thermal image showing possible output as described in Task 1 (with man instead of glass of water)][thermal_man]

[thermal_man]: ../img/thermal_man.png
	"Figure 1: Thermal image showing possible output as described in Task 1 (with man instead of glass of water)"


## Project Needs

Hardware, tools, supplies anticipated for project:

- PIC microcontroller[^PIC-Product-List] with I2C capabilities to connect with thermometer sensor
	- PIC24FJ was chosen as it has sufficient USB connectivity for DIP package variation
- MLX90614 sensor[^MLX-Product]
- Custom PCB and components
	- resistors
	- capacitors
	- switches
	- connectors (PICkit3 header, micro USB female connector)
- Soldering tools

![MLX90614 TO-CAN package (actual package may differ cosmetically depending on variation of sensor ordered)][mlx_to_can]

*Additional information pertaining to specific hardware and software needs can be found in Design section.*

*Full Bill of Materials (BOM) can also be found in Design section.*

[mlx_to_can]: ../img/mlx_to_can.jpg
	"Figure 2: MLX90614 TO-CAN package (actual package may differ cosmetically depending on variation of sensor ordered)"

[^PIC-Product-List]: http://www.microchip.com/ParamChartSearch/Chart.aspx?branchID=8187

[^MLX-Product]: http://www.melexis.com/Infrared-Thermometer-Sensors/Infrared-Thermometer-Sensors/MLX90614-615.aspx

## Team Roster

Joshua Alexander – Hardware/Software Designer

