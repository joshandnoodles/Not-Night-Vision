# Design

## Background

### Problem Statement

Thermal imaging systems are rarely seen in system applications due to their extremely high cost and technical barriers of entry. Thermal sensor ICs alone are >$250 (FLIR development kits). Others do not offer true capture of medium wavelength infrared signals. Many applications do not utilize fast imaging techniques which mean that low-refresh rates and low resolutions may be acceptable.

Not Night Vision is a medically-accurate, low-cost thermal imaging system using a moving single-pixel, non-contact thermometer.

### Why Single-Pixel?

The smart aleck in the room might be asking, 

>"Why didn't you use an 2D IR image sensor?" 

That is a great question. For one, mature devices using a quality infrared (IR) image sensors often range in the thousands of dollars. *This trend has recently been broken by products finally nearing consumer level prices. A good example of this is the FLIR ONE[^FLIR-ONE-Product]. However, these systems using relatively low quality image sensors are still in the range of \$200-\$300.* Another might say,

>"I can buy an IR image sensor like the NoIR[^NoIR-Product] for \$35!"

Not going to lie, that sounds pretty great. I even linked the product page so you know it is true. The truth is the NoIR board is that it is one of many systems that utilize near-infrared (NIR) wavelengths. These sensors are great. They are cheap, easy to use, and have "IR" in the product name. The thing about these NIR sensors is that they only collect an extremely small range of wavelengths in the infrared spectrum. Infrared starts on the edge of visible light at 750nm and extends all the way to 1000000nm (1mm). This might not seem like a big deal until we look at what wavelengths most objects radiate infrared radiation at.

![][blackbody_spectrum][^Black-Body-Spectrum]

Quickly, we see that NIR sensors will not be super helpful in building a thermal camera *unless we are looking at objects heated precisely to 500&deg;C*.

The advantage of using a sensor that operates in the Medium Wavelength Infrared (MWIR) is that we will be able to see infrared radiation from objects of reasonable temperature. This is fitting since MWIR is often referred to as "thermal infrared".

[blackbody_spectrum]: ./img/blackbody_spectrum.jpg
	"Figure !!: Black body spectrum for temperatures between -150&deg;C and 1200&deg;C"

[Black-Body-Spectrum]: http://community.wolfram.com/groups/-/m/t/246929

[^FLIR-ONE-Product]: http://www.flir.com/flirone/

[^NoIR-Product]: https://www.adafruit.com/products/1567af

[^Black-Body-Spectrum]: http://community.wolfram.com/groups/-/m/t/246929

## Device Selection

### The Sensor

I will walk you through the reasoning on the exact non-contact thermometer I chose. The chart in Figure !! details the part number notation and the various configurations. The first choice was whether we needed a thermometer capable of high heat measurements (>85&deg;C). For our use case, there were no foreseeable reasons to measure this high. A temperature code of [E] should be sufficient.

![][mlx_part_number][^MLX-Datasheet]
 
Next, we need to look at the option codes. A voltage supply of 3V will already be readily available for use with the PIC24. It would be convenient to use the same source, supply voltage/accuracy code of [B] or [D]. The area of concern for the number of thermopiles option is the settling time of the thermometer. Since we will be hoping to take readings from the thermometer in rapid succession, we want the settling time to be as small as possible. Looking at the chart in Figure !!, we see that generally the less thermopiles, the smaller the settling time. Additionally, to this, the gradient compensated version is even slower than the dual zone version. This warrants desiring a code of [A] for number of thermopiles.

![][mlx_settling_time][^MLX-Datasheet]

So far, the part number code considerations have been more or less negotiable. It would be convenient to agree with them but in the end, they are minor issues. The last part number code is more crucial to the success of the device. The last option code, the package option, specifies the package the sensor will be put in affecting the field of view (FOV).  The entire basis for a single-pixel camera necessitates sensor FOV that is narrow enough to represent a pixel. The MLX90614 is already known for being a high accuracy, non-contact thermometer with a narrow FOV. And from its variants, we want the version with narrowest FOV 5&deg;, option code [I]. For reference, the FOV of the MLX90614xCI version of the sensor is shown in Figure !!.

![][mlx_fov][^MLX-Datasheet]

Putting this all together, the part number option for the package (related to FOV) takes priority as talked about earlier. I will use the notation of x representing “do not care”. This gives us an ideal part number of MLX90614ESF-AAI-000-TU. Unfortunately, the MLX90614 only comes in [B/D]Cx if we want package option [I] (FOV of 5&deg;). This leaves us with a best-case part number of MLX90614ESF-BCI-000-TU. However, our criteria for an acceptable sensor would allow a part number of MLX90614xSF-xxI-000-TU which means a part number of MLX90614ESF-BCI-000-TU is still acceptable.

Now that the gritty model numbers are out of the way, the MLX90614ESF-DCI-000-TU sensor being used in our system will now be referred to as the MLX sensor.

![][to39_drawing_top][^Metal-Can-Packages]

[mlx_part_number]: ./img/mlx_part_number.png
	"Figure !!: Part number information notation (See datasheet for MLX90614 for commentary on thermal gradients. All xCx versions measure thermal gradients are measured internally and compensated appropriately. However, thermal gradient effects are diminished but not eliminated. They can be further reduced by shielding the sensor or proper board placement.)"

[mlx_settling_time]: ./img/mlx_settling_time.png
	"Figure !!: Factory default infinite impulse response (IIR) and finite impulse response (FIR) configuration, settling time, and typical noise"
	
[mlx_fov]: ./img/mlx_fov.png
	"Figure !!: Typical FOV for MLX90614xCI variants"

[to39_drawing_top]: ./img/to39_drawing_top.png
	"Figure !!: Drawing of TO-39 package (package of MLX sensor)"

[^MLX-Datasheet]: http://www.melexis.com/Infrared-Thermometer-Sensors/Infrared-Thermometer-Sensors/MLX90614-615.aspx

[^Metal-Can-Packages]: http://www.ti.com/lit/an/snoa033/snoa033.pdf


### The Controller

The PIC24FJ was chosen as the centerpiece microcontroller for this system given that it has plenty of connectivity, speed, and the fact I am familiar with its architecture. Specifically, the PIC24FJ128GB202-I/SP-ND version was chosen (referred to as the PIC24 in the rest of the document). With 128KB of program memory, 16Kx16 of RAM, 6 10-bit ADCs, USB connectivity, PWM support, and an operating voltage that matches that of our chosen MLX sensor, we should be confident that this PIC will be able to satisfy the design requirements for this system (and most likely future iterations of this system). 

![][smbus_ram_read_waveform]

You might think it unusual that a DIP packaged version which is shown in Figure !! was chosen. My reasoning behind this is that I wanted maximum wiring change flexibility right up to the point of layout. Having the DIP packaged version allows me to breadboard the entire circuit before anything permanent takes place. Additionally, I originally wanted to create my PCB using an in-house CNC milling machine. The DIP package through-hole legs and generous spacing makes the prospect of soldering onto my PCB made by this milling machine much less intimidating.

![][pic_pinout][^PIC-Datasheet]

[smbus_ram_read_waveform]: ./img/smbus_ram_read_waveform.png
	"Figure !!: Waveform capture of single SMBus RAM read operation to the MLX sensor reading a value 15094 using 5A1""

[pic_pinout]: ./img/pic_pinout.png
	"Figure !!: Pinout for PIC24FJXXXGB202 28-Pin SPDIP/SOIC/SSOP variants"

[^PIC-Datasheet]: http://www.microchip.com/wwwproducts/en/PIC24FJ128GB202

### The Gimbal

A dual servo pan/tilt mechanism will be used to steer sensor across its environments. During the selection process, primary considerations were given to the gimbal being small size with secondary considerations given to high stabilization (no vibrations) and alignment accuracy.

![][servo_mount][^Gimbal-Link]

[servo_mount]: ./img/servo_mount.png
	"Figure !!: Pan/tilt servo mount for system allowing for 180-degree rotation for both pan and tilt motions"	

[^Gimbal-Link]: https://www.adafruit.com/product/1967

## Firmware Design

All firmware code was written in C for bare metal operation. MPLAB X IDE used for development and in-circuit debugging.

![][fw_flow]

[fw_flow]: ./img/fw_flow.png
	"Figure !!: Flowchart representing high-level MCU program logic"	

## Hardware Design

![][hw_block]

[hw_block]: ./img/hw_block.png
	"Figure !!: Block diagram representing system-wide connections"	

### PCB

All physical design was done in Eagle CAD (schematic capture and layout). The final dimensions of the board are 39mm by 51.5mm. Reworks were needed on laser diode footprint and micro USB connector.

#### Schematic Capture

![][eagle_schematic_1]

![][eagle_schematic_2]

[eagle_schematic_1]: ./img/eagle_schematic_1.png
	"Figure !!: Schematic created using Eagle CAD"

[eagle_schematic_2]: ./img/eagle_schematic_2.png
	"Figure !!: Schematic created using Eagle CAD"
  
#### Layout

![][eagle_layout_top]

![][eagle_layout_bot]

[eagle_layout_top]: ./img/eagle_layout_top.png
	"Figure !!: PCB layout created using Eagle CAD"

[eagle_layout_bot]: ./img/eagle_layout_bot.png
	"Figure !!: PCB layout created using Eagle CAD"

#### BOM

![][bom]

[bom]: ./img/bom.png
	"Figure !!: Bill of Materials (BOM) created using Eagle CAD"

## Results

![][sys_photo_1]

A very early initial result from the system can be seen in Figure !!. In this image, a man is layout horizontally with his hand propped under his hand. A cold beverage sides in front of him and is seen here as a tall blue object.

![][thermal_man_and_root_beer]

The final system is capable of both user-guided thermal measuring and pre-defined scan patterns over a 180&deg; half sphere. The system uses a linear mapping of temperature values to a color spectrum to create a heatmap image on the interface. A result of the system showing a man sitting down with a glass of cold water on the left and slightly warm laptop on the right is shown in Figure !!.

![][thermal_man_sitting]

Mature iterations of the system and interface were developed with consideration of limitations found in the system. The most significant limitation found was the MLX sensor's long settling time of 0.65 seconds. This severely limited the system’s ability to scan the environment quickly. Temperature transient artifacts of previous measurements be seen both in Figure !! and Figure !! (specifically, at the left-most column pixels).

With this limitation in mind, the firmware logic revolved around the USB interface being the main director in the loop rather than the MCU starting/stopping most operations. This resulted in the final Chrome App interrace shown in Figure !!. Notice that full control of measuring and scanning activities are controlled from the user's USB endpoint.

![][thermal_man_sitting_w_interface]

[sys_photo_1]: ./img/sys_photo_1.jpg
	"Figure !!: Image of the final product after all reworks had been completed"

[thermal_man_and_root_beer]: ./img/thermal_man_and_root_beer.png
	"Figure !!: Very first image retrieved from Not Night capturing a man lying on the ground next to a cold root beer"

[thermal_man_sitting]: ./img/thermal_man_sitting.png
	"Figure !!: Image retrieved from Not Night capturing a man sitting on a couch with a warm object on the right and cold object on the left"

[thermal_man_sitting_w_interface]: ./img/thermal_man_sitting_w_interface.png
	"Figure !!: Image retrieved from Not Night capturing a man sitting on a couch showcasing the control sidebar of the Chrome App interface"

## Future Improvements

  - Use MLX sensor's ambient temperature measurements to correct for systematic temperature reading errors
  - Move MLX sensor and laser to separate PCB
    - Reduce load on gimbal
    - Reduce heating effects from power supply and MCU
  - Implement projection of thermal imaging data on top of visible spectrum
    - Additional camera sensor needed
  - Non-linear heatmap mapping of temperature readings to color
