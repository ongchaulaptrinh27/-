const correctPin = "1009"

let matrixRainInterval = null
let isMatrixActive = false

function isMobile() {
    return window.innerWidth <= 768
}

function isLandscape() {
    return window.innerWidth > window.innerHeight
}

function getOptimalFontSize() {
    const width = window.innerWidth
    const height = window.innerHeight
    const minDimension = Math.min(width, height)

    // Dynamic font sizing based on screen size
    if (minDimension < 480) return 10
    if (minDimension < 640) return 12
    if (minDimension < 768) return 14
    return 16
}

function handleOrientationChange() {
    setTimeout(() => {
        if (isMatrixActive) {
            const canvas = document.getElementById("matrixRain")
            if (canvas) {
                canvas.width = window.innerWidth
                canvas.height = window.innerHeight
                // Restart matrix rain with new dimensions
                if (matrixRainInterval) {
                    clearInterval(matrixRainInterval)
                    initMatrixRain()
                }
            }
        }
    }, 200)
}

// Listen for orientation changes
window.addEventListener("orientationchange", handleOrientationChange)
window.addEventListener("resize", handleOrientationChange)

function initMatrixRain() {
    const canvas = document.getElementById("matrixRain")
    const ctx = canvas.getContext("2d")

    // Set canvas size
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const matrix = "sangdev201127"
    // const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}❤️"
    const matrixArray = matrix.split("")

    const fontSize = getOptimalFontSize()
    const columns = Math.floor(canvas.width / fontSize)

    const drops = []
    for (let x = 0; x < columns; x++) {
        drops[x] = 1
    }

    function draw() {
        // Semi-transparent black rectangle for trail effect
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.fillStyle = "#00ccff"
        ctx.font = fontSize + "px monospace"

        for (let i = 0; i < drops.length; i++) {
            const text = matrixArray[Math.floor(Math.random() * matrixArray.length)]
            ctx.fillText(text, i * fontSize, drops[i] * fontSize)

            // Reset drop when it reaches bottom
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0
            }
            drops[i]++
        }
    }

    // Optimized animation interval
    const interval = isMobile() ? 50 : 35
    matrixRainInterval = setInterval(draw, interval)
}

function checkPin() {
    const otp1 = document.getElementById("otp1").value
    const otp2 = document.getElementById("otp2").value
    const otp3 = document.getElementById("otp3").value
    const otp4 = document.getElementById("otp4").value

    const inputPin = otp1 + otp2 + otp3 + otp4
    const errorMessage = document.getElementById("errorMessage")

    if (inputPin === correctPin) {
        // Success effect
        createSuccessEffect()

        setTimeout(() => {
            // Hide PIN container
            document.getElementById("pinContainer").style.display = "none"

            // Check if mobile and not in landscape
            if (isMobile() && !isLandscape()) {
                showLandscapeNotification()
            } else {
                showMatrixDisplay()
            }
        }, 800)
    } else {
        errorMessage.innerHTML = '<i class="bi bi-bug"></i> Sai mật mã rồii! Thử lại lần nữa.'
        errorMessage.classList.add("show")

        // Create error shake effect for inputs
        document.querySelectorAll(".otp-input").forEach((input) => {
            input.style.animation = "errorShake 0.6s ease-out"
            input.classList.remove("filled")
            setTimeout(() => {
                input.style.animation = ""
            }, 600)
        })

        // Clear all OTP inputs
        document.getElementById("otp1").value = ""
        document.getElementById("otp2").value = ""
        document.getElementById("otp3").value = ""
        document.getElementById("otp4").value = ""

        // Focus first input
        document.getElementById("otp1").focus()

        // Clear error after 3 seconds
        setTimeout(() => {
            errorMessage.classList.remove("show")
            setTimeout(() => {
                errorMessage.textContent = ""
            }, 400)
        }, 3000)
    }
}

function showLandscapeNotification() {
    const notification = document.getElementById("landscapeNotification")
    notification.classList.add("show")

    // Auto-hide notification after 5 seconds
    setTimeout(() => {
        if (notification.classList.contains("show")) {
            skipLandscapeMode()
        }
    }, 10000)

    // Check for orientation change
    const orientationChecker = setInterval(() => {
        if (isLandscape()) {
            clearInterval(orientationChecker)
            notification.classList.remove("show")
            showMatrixDisplay()
        }
    }, 500)

    // Store interval reference to clear it if user skips
    notification.dataset.orientationChecker = orientationChecker
}

function skipLandscapeMode() {
    const notification = document.getElementById("landscapeNotification")
    const orientationChecker = notification.dataset.orientationChecker

    if (orientationChecker) {
        clearInterval(orientationChecker)
    }

    notification.classList.remove("show")
    showMatrixDisplay()
}

function showMatrixDisplay() {
    const matrixContainer = document.getElementById("matrixContainer")
    matrixContainer.style.display = "block"
    isMatrixActive = true

    // Initialize matrix rain
    initMatrixRain()

    // Start matrix text sequence
    startMatrixSequence()
}

// Matrix text sequence with glitch effect
function startMatrixSequence() {
    const messages = ["HAPPY BIRTHDAY", "TO ME", "?0-0?-20??", "tên bạn", "MỞ KHÓA", "THÀNH TÍCH ??+"]
    let currentIndex = 0

    function createTextDisplay(text) {
        const container = document.getElementById("matrixText")
        container.innerHTML = ""
        container.className = "matrix-text"

        // Handle long text by breaking it into multiple lines if needed
        const maxCharsPerLine = isMobile() ? 15 : 25
        const displayText = text

        if (text.length > maxCharsPerLine && isMobile()) {
            // Split long text into words and create lines
            const words = text.split(" ")
            const lines = []
            let currentLine = ""

            words.forEach((word) => {
                if ((currentLine + word).length <= maxCharsPerLine) {
                    currentLine += (currentLine ? " " : "") + word
                } else {
                    if (currentLine) lines.push(currentLine)
                    currentLine = word
                }
            })
            if (currentLine) lines.push(currentLine)

            lines.forEach((line, lineIndex) => {
                const lineDiv = document.createElement("div")
                const chars = line.split("")

                chars.forEach((char, index) => {
                    const span = document.createElement("span")
                    span.className = "char glitch-char"
                    span.textContent = char === " " ? "\u00A0" : char
                    span.setAttribute("data-text", char === " " ? "\u00A0" : char)

                    const delay = lineIndex * chars.length * 80 + index * 80
                    span.style.animationDelay = delay + "ms"

                    const glitchChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*(){}[]|\\:;\"'<>,.?/~`"
                    let glitchInterval

                    setTimeout(() => {
                        let glitchCount = 0
                        glitchInterval = setInterval(() => {
                            if (glitchCount < 8) {
                                span.textContent = glitchChars[Math.floor(Math.random() * glitchChars.length)]
                                glitchCount++
                            } else {
                                span.textContent = char === " " ? "\u00A0" : char
                                clearInterval(glitchInterval)
                            }
                        }, 50)
                    }, delay)

                    lineDiv.appendChild(span)
                })

                container.appendChild(lineDiv)
            })
        } else {
            const chars = displayText.split("")
            chars.forEach((char, index) => {
                const span = document.createElement("span")
                span.className = "char glitch-char"
                span.textContent = char === " " ? "\u00A0" : char
                span.setAttribute("data-text", char === " " ? "\u00A0" : char)

                const delay = index * 80
                span.style.animationDelay = delay + "ms"

                const glitchChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*(){}[]|\\:;\"'<>,.?/~`"
                let glitchInterval

                setTimeout(() => {
                    let glitchCount = 0
                    glitchInterval = setInterval(() => {
                        if (glitchCount < 8) {
                            span.textContent = glitchChars[Math.floor(Math.random() * glitchChars.length)]
                            glitchCount++
                        } else {
                            span.textContent = char === " " ? "\u00A0" : char
                            clearInterval(glitchInterval)
                        }
                    }, 50)
                }, delay)

                container.appendChild(span)
            })
        }

        container.classList.add("show")

        const totalChars = displayText.replace(/\s/g, "").length
        const totalAnimationTime = totalChars * 80 + 800
        return totalAnimationTime
    }

    function showNextMessage() {
        if (currentIndex >= messages.length) {
            const container = document.getElementById("matrixText")
            container.classList.add("fade-out")

            setTimeout(() => {
                createFinalDisplay()
            }, 500) // Faster transition
            return
        }

        const container = document.getElementById("matrixText")
        const message = messages[currentIndex]

        // Fade out current text
        container.classList.add("fade-out")

        setTimeout(() => {
            const animationTime = createTextDisplay(message)

            const displayTime = isMobile() ? 800 : 1000
            setTimeout(() => {
                currentIndex++
                showNextMessage()
            }, animationTime + displayTime)
        }, 100) // Faster fade transition
    }

    showNextMessage()
}

function createFinalDisplay() {
    const container = document.getElementById("matrixText")
    container.innerHTML = ""
    container.className = "final-display"

    const logoImg = document.createElement("img")
    logoImg.src = "images/logoTP.png"
    logoImg.alt = "Logo TP"
    logoImg.className = "final-logo"

    // 👉 Thêm sự kiện click để chuyển hướng sang index4.html
    logoImg.addEventListener("click", function() {
        window.location.href = "index2.html"
    })

    container.appendChild(logoImg)
    container.classList.add("show")
}


document.addEventListener("DOMContentLoaded", () => {
    const otpInputs = document.querySelectorAll(".otp-input")

    otpInputs.forEach((input, index) => {
        input.addEventListener("input", function (e) {
            // Only allow numbers
            this.value = this.value.replace(/[^0-9]/g, "")

            // Add filled class for visual effect
            if (this.value.length === 1) {
                this.classList.add("filled")
                createInputParticles(this)
            } else {
                this.classList.remove("filled")
            }

            // Move to next input if current is filled
            if (this.value.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus()
            }
        })

        input.addEventListener("keydown", function (e) {
            // Handle backspace
            if (e.key === "Backspace") {
                if (this.value === "" && index > 0) {
                    otpInputs[index - 1].focus()
                } else {
                    this.classList.remove("filled")
                }
            }

            // Handle Enter key
            if (e.key === "Enter") {
                checkPin()
            }
        })

        // Enhanced paste handling
        input.addEventListener("paste", (e) => {
            e.preventDefault()
            const pastedData = e.clipboardData
                .getData("text")
                .replace(/[^0-9]/g, "")
                .slice(0, 4)

            for (let i = 0; i < pastedData.length && index + i < otpInputs.length; i++) {
                const targetInput = otpInputs[index + i]
                targetInput.value = pastedData[i]
                targetInput.classList.add("filled")
                createInputParticles(targetInput)
            }

            // Focus the next empty input or the last one
            const nextEmptyIndex = Math.min(index + pastedData.length, otpInputs.length - 1)
            otpInputs[nextEmptyIndex].focus()
        })

        // Add focus effects
        input.addEventListener("focus", function () {
            createFocusRipple(this)
        })
    })
})

function createInputParticles(input) {
    const rect = input.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    for (let i = 0; i < 8; i++) {
        const particle = document.createElement("div")
        particle.className = "input-particle"
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: #00ccff;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            left: ${centerX}px;
            top: ${centerY}px;
            box-shadow: 0 0 6px #00ccff;
        `

        const angle = (i / 8) * Math.PI * 2
        const distance = 30 + Math.random() * 20
        const endX = Math.cos(angle) * distance
        const endY = Math.sin(angle) * distance

        particle.style.setProperty("--end-x", endX + "px")
        particle.style.setProperty("--end-y", endY + "px")

        document.body.appendChild(particle)

        particle.animate(
            [
                { transform: "translate(0, 0) scale(1)", opacity: 1 },
                { transform: `translate(${endX}px, ${endY}px) scale(0)`, opacity: 0 },
            ],
            {
                duration: 600,
                easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            },
        ).onfinish = () => particle.remove()
    }
}

function createFocusRipple(input) {
    const rect = input.getBoundingClientRect()
    const ripple = document.createElement("div")
    ripple.style.cssText = `
        position: fixed;
        left: ${rect.left}px;
        top: ${rect.top}px;
        width: ${rect.width}px;
        height: ${rect.height}px;
        border: 2px solid #00ccff;
        border-radius: 16px;
        pointer-events: none;
        z-index: 999;
        opacity: 0.8;
    `

    document.body.appendChild(ripple)

    ripple.animate(
        [
            { transform: "scale(1)", opacity: 0.8 },
            { transform: "scale(1.2)", opacity: 0 },
        ],
        {
            duration: 400,
            easing: "ease-out",
        },
    ).onfinish = () => ripple.remove()
}

function createSuccessEffect() {
    const pinCard = document.querySelector(".pin-card")
    const rect = pinCard.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Create success particles
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement("div")
        particle.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: #00ff88;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            left: ${centerX}px;
            top: ${centerY}px;
            box-shadow: 0 0 10px #00ff88;
        `

        const angle = (i / 20) * Math.PI * 2
        const distance = 100 + Math.random() * 50
        const endX = Math.cos(angle) * distance
        const endY = Math.sin(angle) * distance

        document.body.appendChild(particle)

        particle.animate(
            [
                { transform: "translate(0, 0) scale(1)", opacity: 1 },
                { transform: `translate(${endX}px, ${endY}px) scale(0)`, opacity: 0 },
            ],
            {
                duration: 1000,
                easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            },
        ).onfinish = () => particle.remove()
    }

    // Add success glow to card
    pinCard.style.boxShadow = `
        0 0 60px rgba(0, 255, 136, 0.6),
        0 0 100px rgba(0, 255, 136, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `
}

// Improved resize handler
window.addEventListener("resize", () => {
    if (isMatrixActive) {
        handleOrientationChange()
    }
})

// Focus first OTP input on mobile for better UX
if (isMobile()) {
    window.addEventListener("load", () => {
        setTimeout(() => {
            const firstOtpInput = document.getElementById("otp1")
            if (firstOtpInput) {
                firstOtpInput.focus()
            }
        }, 100)
    })
}

// Prevent zoom on double tap for better mobile experience
document.addEventListener(
    "touchend",
    (event) => {
        const now = new Date().getTime()
        if (now - lastTouchEnd <= 300) {
            event.preventDefault()
        }
        lastTouchEnd = now
    },
    false,
)

let lastTouchEnd = 0