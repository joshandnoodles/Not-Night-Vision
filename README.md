---
title: Not Night Vision
author: Joshua Alexander
institution: University of Cincinnati
date: \today
header-includes:
    - \usepackage{fancyhdr}
    - \pagestyle{fancy}
    - \lhead{Joshua Alexander}
    - \chead{Not Night Vision}
    - \rhead{\today}
	- \cfoot{\thepage}
geometry: margin=0.75in
output: pdf_document

---

\newpage
\tableofcontents

## **Not Night Vision** by Joshua Alexander

	"Single-Pixel Thermal Imaging Solution Using PIC24EP and MLX90614"

* [Vision](#vision)
* [Project Evaluation](#project-evaluation)
* [Design Decisions](#design-decisions)
	* [The Sensor](#the-sensor)
	* [The Controller](#the-controller)
* [Future Improvements](#future-improvements)


## Vision [vision]


Using a PIC microcontroller and a non-contact infrared thermometer, MLX90614, an extremely low-cost thermal imaging system can be realized at a price point where thermal imaging data will be able to supplement and potentially replace traditional imaging solutions. The small, low cost MLX90614’s high precision measurements along with its narrow field of view (5&deg;) allow for cheap thermal data at a resolution that was previously unimaginable. Existing thermal imaging concepts using this sensor have already seen success  . However, the benefits of this sensor can be further exploited by using the following devices: mirrors to reduce vibrations and increase tracking speed, optics/diaphragm to precisely change pixel size for objects of varying size or varying distances, sampling and interpolation techniques, and low-level software changes to enhance sensor’s data collection. 

## Project Evaluation

At the conclusion of the project, success will be determined based on the system’s ability to complete the following tasks:

* Reconstruct a 64-pixel image of a glass of heated water placed 10 meters away 
	* Temperature accuracy of +/1&deg;F
* Image capture time <= 60 sec
	* Track a designated person moving at walking speed in a room maintaining tracking on that person even with other non-moving people in the room 

## Design Decisions

### The Sensor

I will walk you through the reasoning on the exact thermometer I chose. The chart in Figure 1 details the part number notation and the various configurations. The first choice was whether we needed a thermometer capable of high heat measurements (>85&deg;C). For our use case, there were no foreseeable reasons to measure this high. A temperature code of [E] should be sufficient. 
 
Figure 1 Part number information notation (See datasheet for MLX90614 for commentary on thermal gradients. All xCx versions measure thermal gradients are measured internally and compensated appropriately. However, thermal gradient effects are diminished but not eliminated. They can be further reduced by shielding the sensor or proper board placement.)
Next ,we need to look at the option codes. A voltage supply of 3V will already be readily available for use with the PIC24. It would be convenient to use the same source, supply voltage/accuracy code of [B] or [D]. The area of concern for the number of thermopiles option is the settling time of the thermometer. Since we will be hoping to take readings from the thermometer in rapid succession, we want the settling time to be as small as possible. Looking at the chart in Figure 2, we see that generally the less thermopiles, the smaller the settling time. Additionally to this, the gradient compensated version is even slower than the dual zone version. This warrants desiring a code of [A] for number of thermopiles.
 
Figure 2 Factory default infinite impulse response (IIR) and finite impulse response (FIR) configuration, settling time, and typical noise
So far, the part number codes have been more or less negotiable. It would be convenient to agree with them but in the end minor issues. The last part number code is more crucial to the success of the device. The last option code, the package option, specifies the package the sensor will be put in affecting the field of view (FOV).  The entire basis for a single-pixel camera necessitates sensor FOV that is narrow enough to represent a pixel. The MLX90614 is already known for being a high accuracy, non-contact thermometer with a narrow FOV. And from its variants, we want the version with narrowest FOV 5&deg;, option code [I]. For reference, the FOV of the MLX90614xCI version of the sensor is shown in Figure 3.
 
Figure 3 Typical FOV for MLX90614xCI variants

Putting this all together, the part number option for the package option (related to FOV) takes priority as talked about earlier. I will use the notation of x representing “do not care”. This gives us an ideal part number of MLX90614ESF-AAI-000-TU. Unfortunately, the MLX90614 only comes in [B/D]Cx if we want package option [I] (FOV of 5&deg;). This leaves us with a best case part number of MLX90614ESF-BCI-000-TU. However, our criteria for an acceptable sensor would allow a part number of MLX90614xSF-xxI-000-TU which means a part number of MLX90614ESF-BCI-000-TU is still acceptable.

Now that the gritty model numbers are out of the way, the MLX90614ESF-DCI-000-TU sensor being used in our system will now be referred to as the MLX sensor.

### The Controller

## Future Improvements

* Use of PIC24’s on-chip temperature measurement comparing against MLX sensor’s chip temperature to make corrections for systematic temperature errors and/or thermal heating of components
* Move MLX sensor and laser to separate PCB to reduce load on gimbal and effects of component heating from power supply and PIC24


Documents
-------------

StackEdit stores your documents in your browser, which means all your documents are automatically saved locally and are accessible **offline!**

> **Note:**

> - StackEdit is accessible offline after the application has been loaded for the first time.
> - Your local documents are not shared between different browsers or computers.
> - Clearing your browser's data may **delete all your local documents!** Make sure your documents are synchronized with **Google Drive** or **Dropbox** (check out the [<i class="icon-refresh"></i> Synchronization](#synchronization) section).

#### <i class="icon-file"></i> Create a document

The document panel is accessible using the <i class="icon-folder-open"></i> button in the navigation bar. You can create a new document by clicking <i class="icon-file"></i> **New document** in the document panel.

#### <i class="icon-folder-open"></i> Switch to another document

All your local documents are listed in the document panel. You can switch from one to another by clicking a document in the list or you can toggle documents using <kbd>Ctrl+[</kbd> and <kbd>Ctrl+]</kbd>.

#### <i class="icon-pencil"></i> Rename a document

You can rename the current document by clicking the document title in the navigation bar.

#### <i class="icon-trash"></i> Delete a document

You can delete the current document by clicking <i class="icon-trash"></i> **Delete document** in the document panel.

#### <i class="icon-hdd"></i> Export a document

You can save the current document to a file by clicking <i class="icon-hdd"></i> **Export to disk** from the <i class="icon-provider-stackedit"></i> menu panel.

> **Tip:** Check out the [<i class="icon-upload"></i> Publish a document](#publish-a-document) section for a description of the different output formats.


----------


Synchronization
-------------------

StackEdit can be combined with <i class="icon-provider-gdrive"></i> **Google Drive** and <i class="icon-provider-dropbox"></i> **Dropbox** to have your documents saved in the *Cloud*. The synchronization mechanism takes care of uploading your modifications or downloading the latest version of your documents.

> **Note:**

> - Full access to **Google Drive** or **Dropbox** is required to be able to import any document in StackEdit. Permission restrictions can be configured in the settings.
> - Imported documents are downloaded in your browser and are not transmitted to a server.
> - If you experience problems saving your documents on Google Drive, check and optionally disable browser extensions, such as Disconnect.

#### <i class="icon-refresh"></i> Open a document

You can open a document from <i class="icon-provider-gdrive"></i> **Google Drive** or the <i class="icon-provider-dropbox"></i> **Dropbox** by opening the <i class="icon-refresh"></i> **Synchronize** sub-menu and by clicking **Open from...**. Once opened, any modification in your document will be automatically synchronized with the file in your **Google Drive** / **Dropbox** account.

#### <i class="icon-refresh"></i> Save a document

You can save any document by opening the <i class="icon-refresh"></i> **Synchronize** sub-menu and by clicking **Save on...**. Even if your document is already synchronized with **Google Drive** or **Dropbox**, you can export it to a another location. StackEdit can synchronize one document with multiple locations and accounts.

#### <i class="icon-refresh"></i> Synchronize a document

Once your document is linked to a <i class="icon-provider-gdrive"></i> **Google Drive** or a <i class="icon-provider-dropbox"></i> **Dropbox** file, StackEdit will periodically (every 3 minutes) synchronize it by downloading/uploading any modification. A merge will be performed if necessary and conflicts will be detected.

If you just have modified your document and you want to force the synchronization, click the <i class="icon-refresh"></i> button in the navigation bar.

> **Note:** The <i class="icon-refresh"></i> button is disabled when you have no document to synchronize.

#### <i class="icon-refresh"></i> Manage document synchronization

Since one document can be synchronized with multiple locations, you can list and manage synchronized locations by clicking <i class="icon-refresh"></i> **Manage synchronization** in the <i class="icon-refresh"></i> **Synchronize** sub-menu. This will let you remove synchronization locations that are associated to your document.

> **Note:** If you delete the file from **Google Drive** or from **Dropbox**, the document will no longer be synchronized with that location.

----------


Publication
-------------

Once you are happy with your document, you can publish it on different websites directly from StackEdit. As for now, StackEdit can publish on **Blogger**, **Dropbox**, **Gist**, **GitHub**, **Google Drive**, **Tumblr**, **WordPress** and on any SSH server.

#### <i class="icon-upload"></i> Publish a document

You can publish your document by opening the <i class="icon-upload"></i> **Publish** sub-menu and by choosing a website. In the dialog box, you can choose the publication format:

- Markdown, to publish the Markdown text on a website that can interpret it (**GitHub** for instance),
- HTML, to publish the document converted into HTML (on a blog for example),
- Template, to have a full control of the output.

> **Note:** The default template is a simple webpage wrapping your document in HTML format. You can customize it in the **Advanced** tab of the <i class="icon-cog"></i> **Settings** dialog.

#### <i class="icon-upload"></i> Update a publication

After publishing, StackEdit will keep your document linked to that publication which makes it easy for you to update it. Once you have modified your document and you want to update your publication, click on the <i class="icon-upload"></i> button in the navigation bar.

> **Note:** The <i class="icon-upload"></i> button is disabled when your document has not been published yet.

#### <i class="icon-upload"></i> Manage document publication

Since one document can be published on multiple locations, you can list and manage publish locations by clicking <i class="icon-upload"></i> **Manage publication** in the <i class="icon-provider-stackedit"></i> menu panel. This will let you remove publication locations that are associated to your document.

> **Note:** If the file has been removed from the website or the blog, the document will no longer be published on that location.

----------


Markdown Extra
--------------------

StackEdit supports **Markdown Extra**, which extends **Markdown** syntax with some nice features.

> **Tip:** You can disable any **Markdown Extra** feature in the **Extensions** tab of the <i class="icon-cog"></i> **Settings** dialog.

> **Note:** You can find more information about **Markdown** syntax [here][2] and **Markdown Extra** extension [here][3].


### Tables

**Markdown Extra** has a special syntax for tables:

Item     | Value
-------- | ---
Computer | $1600
Phone    | $12
Pipe     | $1

You can specify column alignment with one or two colons:

| Item     | Value | Qty   |
| :------- | ----: | :---: |
| Computer | $1600 |  5    |
| Phone    | $12   |  12   |
| Pipe     | $1    |  234  |


### Definition Lists

**Markdown Extra** has a special syntax for definition lists too:

Term 1
Term 2
:   Definition A
:   Definition B

Term 3

:   Definition C

:   Definition D

	> part of definition D


### Fenced code blocks

GitHub's fenced code blocks are also supported with **Highlight.js** syntax highlighting:

```
// Foo
var bar = 0;
```

> **Tip:** To use **Prettify** instead of **Highlight.js**, just configure the **Markdown Extra** extension in the <i class="icon-cog"></i> **Settings** dialog.

> **Note:** You can find more information:

> - about **Prettify** syntax highlighting [here][5],
> - about **Highlight.js** syntax highlighting [here][6].


### Footnotes

You can create footnotes like this[^footnote].

  [^footnote]: Here is the *text* of the **footnote**.


### SmartyPants

SmartyPants converts ASCII punctuation characters into "smart" typographic punctuation HTML entities. For example:

|                  | ASCII                        | HTML              |
 ----------------- | ---------------------------- | ------------------
| Single backticks | `'Isn't this fun?'`            | 'Isn't this fun?' |
| Quotes           | `"Isn't this fun?"`            | "Isn't this fun?" |
| Dashes           | `-- is en-dash, --- is em-dash` | -- is en-dash, --- is em-dash |


### Table of contents

You can insert a table of contents using the marker `[TOC]`:

[TOC]


### MathJax

You can render *LaTeX* mathematical expressions using **MathJax**, as on [math.stackexchange.com][1]:

The *Gamma function* satisfying $\Gamma(n) = (n-1)!\quad\forall n\in\mathbb N$ is via the Euler integral

$$
\Gamma(z) = \int_0^\infty t^{z-1}e^{-t}dt\,.
$$

> **Tip:** To make sure mathematical expressions are rendered properly on your website, include **MathJax** into your template:

```
<script type="text/javascript" src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML"></script>
```

> **Note:** You can find more information about **LaTeX** mathematical expressions [here][4].


### UML diagrams

You can also render sequence diagrams like this:

```sequence
Alice->Bob: Hello Bob, how are you?
Note right of Bob: Bob thinks
Bob-->Alice: I am good thanks!
```

And flow charts like this:

```flow
st=>start: Start
e=>end
op=>operation: My Operation
cond=>condition: Yes or No?

st->op->cond
cond(yes)->e
cond(no)->op
```

> **Note:** You can find more information:

> - about **Sequence diagrams** syntax [here][7],
> - about **Flow charts** syntax [here][8].

### Support StackEdit

[![](https://cdn.monetizejs.com/resources/button-32.png)](https://monetizejs.com/authorize?client_id=ESTHdCYOi18iLhhO&summary=true)

  [^stackedit]: [StackEdit](https://stackedit.io/) is a full-featured, open-source Markdown editor based on PageDown, the Markdown library used by Stack Overflow and the other Stack Exchange sites.


  [1]: http://math.stackexchange.com/
  [2]: http://daringfireball.net/projects/markdown/syntax "Markdown"
  [3]: https://github.com/jmcmanus/pagedown-extra "Pagedown Extra"
  [4]: http://meta.math.stackexchange.com/questions/5020/mathjax-basic-tutorial-and-quick-reference
  [5]: https://code.google.com/p/google-code-prettify/
  [6]: http://highlightjs.org/
  [7]: http://bramp.github.io/js-sequence-diagrams/
  [8]: http://adrai.github.io/flowchart.js/














































