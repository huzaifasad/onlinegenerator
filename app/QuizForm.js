'use client'
import React, { useState } from 'react';
import './QuizForm.css';
import { FaCopy, FaPrint } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import flag images
import FlagUS from './usimage.png'; // Replace with your actual path
import FlagGB from './usimage.png'; // Replace with your actual path

export default function QuizForm() {
  const [isChecked, setIsChecked] = useState(false);
  const [formData, setFormData] = useState({
    country: 'US',
    quizTopic: '',
    targetAudience: '',
    numQuestions: 1,
    questionType: 'true_false',
    difficulty: 'easy',
    includeAnswers: 'yes',
    additionalInstructions: '',
  });

  const [isLoading, setLoading] = useState(false);
  const [isLoadingx, setLoadingx] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [email, setEmail] = useState('');
  const [isEmailEntered, setIsEmailEntered] = useState(false);
  const [activeTab, setActiveTab] = useState('form'); // New state for tabs

  const handleCheckChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCountryChange = (e) => {
    setFormData({ ...formData, country: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingx(true);
    setIsEmailEntered(false);
    setQuiz('');
    try {
      const response = await fetch('/pages/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      setQuiz(result.quiz);
      setLoadingx(false);
      setActiveTab('quiz'); // Switch to quiz tab on form submission
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleEmailSubmit = async () => {
    if (email) {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsEmailEntered(true);
      } catch (error) {
        console.error('Error submitting email:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const copyToClipboard = () => {
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = quiz;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextArea);

    toast.success('Content copied to clipboard!', {
      position: 'bottom-right',
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      bodyClassName: 'text-[#FFFFFF]',
      className: 'bg-[#434343]',
    });
  };

  const printContent = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(
      <html>
        <head>
          <title>Print Content</title>
        </head>
        <body style="font-family: Arial, sans-serif;">${quiz}</body>
      </html>
    );
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };

  const renderQuizContent = () => {
    if (isEmailEntered) {
      return (
        <div className="mt-4 bg-[#E0E0E0] p-4 pr-10 rounded-lg max-h-96 overflow-y-auto">
          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={copyToClipboard}
              className="bg-[#434343] text-[#FFFFFF] py-1 px-3 rounded flex items-center justify-center hover:bg-[#333333] transition-colors duration-200"
            >
              <FaCopy className="h-5 w-5" />
              <span className="ml-2">Copy Content</span>
            </button>
            <button
              onClick={printContent}
              className="bg-[#434343] text-[#FFFFFF] py-1 px-3 rounded flex items-center justify-center hover:bg-[#333333] transition-colors duration-200"
            >
              <FaPrint className="h-5 w-5" />
              <span className="ml-2">Print Content</span>
            </button>
          </div>
          <div dangerouslySetInnerHTML={{ __html: quiz.replace(/\n/g, '<br>') }} />
        </div>
      );
    } else {
      const words = quiz?.split(' ') || [];
      const firstTenWords = words.slice(0, 10).join(' ');
      const restOfTheData = words.slice(10).join(' ');

      return (
        <div className="mt-4 bg-[#E0E0E0] p-4 rounded-lg max-h-96 overflow-y-auto">
          <div className="text-[#434343] mt-10 pr-10">
            <div dangerouslySetInnerHTML={{ __html: firstTenWords.replace(/\n/g, '<br>') }} />
            <div
              dangerouslySetInnerHTML={{ __html: restOfTheData.replace(/\n/g, '<br>') }}
              className="blur-lg select-none"
              style={{ filter: 'blur(5px)', pointerEvents: 'none' }}
            />
          </div>
        </div>
      );
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-[#f3f3f3] p-8 rounded-lg shadow-md font-space-grotesk text-[#434343]">
       {/* <div className="flex  mb-4 justify-center">
        <button
          onClick={() => setActiveTab('form')}
          className={`px-4 py-2  ${activeTab === 'form' ? 'bg-[#434343] text-[#FFFFFF]' : 'bg-[#E0E0E0] text-[#434343]'} transition-colors duration-200`}
        >
          Form
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`px-4 py-2  ${activeTab === 'quiz' ? 'bg-[#434343] text-[#FFFFFF]' : 'bg-[#E0E0E0] text-[#434343]'} transition-colors duration-200`}
          disabled={!quiz}
        >
          Quiz
        </button>
      </div> */}
      <h2 className="text-2xl font-semibold mb-2">Quiz Generator</h2>
      <p className="text-[#434343] mb-4">
        More info regarding the quiz generator should go here. More info
        regarding the quiz generator should go here.
      </p>

     

      {activeTab === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 md:col-span-1">
              <label className="block mb-1 font-medium md:medium">Quiz Topic</label>
              <input
                type="text"
                name="quizTopic"
                value={formData.quizTopic}
                onChange={handleChange}
                className="w-full p-2 bg-[#FFFFFF] border-none rounded"
                required
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block mb-1 font-medium">Target Audience</label>
              <input
                type="text"
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleChange}
                className="w-full p-2 bg-[#FFFFFF] border-none rounded"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 md:col-span-1">
              <label className="block mb-1 font-medium">Number of Questions</label>
              <input
                type="number"
                name="numQuestions"
                value={formData.numQuestions}
                onChange={handleChange}
                min="1"
                max="50"
                className="w-full p-2 bg-[#FFFFFF] border-none rounded"
                required
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block mb-1 font-medium">Question Type</label>
              <select
                name="questionType"
                value={formData.questionType}
                onChange={handleChange}
                className="w-full p-2 bg-[#FFFFFF] border-none rounded"
                required
              >
                <option value="true_false">True/False</option>
                <option value="multiple_choice">Multiple Choice</option>
                <option value="short_answer">Short Answer</option>
              </select>
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block mb-1 font-medium">Difficulty</label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full p-2 bg-[#FFFFFF] border-none rounded"
                required
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 md:col-span-1">
          <label className="block mb-1 font-medium">Country</label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full p-2 bg-[#FFFFFF] border-none rounded"
            required
          >
            <option value="US">United States</option>
            <option value="GB">United Kingdom</option>
          </select>
        </div>
        <div className="col-span-2 md:col-span-1">
          <label className="block mb-1 font-medium">Include Answers?</label>
          <select
            name="includeAnswers"
            value={formData.includeAnswers}
            onChange={handleChange}
            className="w-full p-2 bg-[#FFFFFF] border-none rounded"
            required
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
      </div>

          <div className="grid grid-cols-2 gap-4">
           
          </div>
          <div>
            <label className="block mb-1 font-medium">Other Info</label>
            <textarea
              name="additionalInstructions"
              value={formData.additionalInstructions}
              onChange={handleChange}
              className="w-full p-2 bg-[#FFFFFF] border-none rounded"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-36 p-2 bg-[#434343] text-[#FFFFFF] rounded flex items-center justify-center ml-auto"
            disabled={isLoading}
          >
            {isLoadingx ? (
                <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0c4.418 0 8 3.582 8 8s-3.582 8-8 8-8-3.582-8-8z"
                  />
                </svg>
                <span>Loading</span>
              </div>
            ) : (
              <>
                Generate
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="ml-2 h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 12h14M12 5l7 7-7 7"
                  />
                </svg>
              </>
            )}
          </button>
        </form>
      )}

      {activeTab === 'quiz' && (
        <div>
          {renderQuizContent()}
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setActiveTab('form')}
              className="bg-[#434343] text-[#FFFFFF] py-2 px-4 rounded hover:bg-[#333333] transition-colors duration-200"
            >
              Back to Form
            </button>
          </div>
          {!isEmailEntered && (
            <div className="mt-4  ">
 <div className="text-lg font-semibold text-[#434343] mb-4 text-center mt-4">
          Enter your email below to get the full quiz (for free)...
        </div>              <div className="relative m-auto sm:max-w-md  ">
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              className="w-full p-3 pr-24 border border-gray-400 rounded mb-2 sm:mb-0 sm:mr-2 focus:outline-none focus:ring-2 focus:ring-[#434343] outline-none ring-2 ring-[#434343]"
              placeholder="Email"
            />
            <button
              onClick={handleEmailSubmit}
              className="absolute top-0 right-0 bg-[#434343] text-[#FFFFFF] py-2 px-8 h-full hover:bg-[#333333] transition-colors duration-200"
            >
              {isLoading ? (
                 <div className="flex items-center justify-center">
                 <svg
                   className="animate-spin h-5 w-5 mr-3"
                   xmlns="http://www.w3.org/2000/svg"
                   fill="none"
                   viewBox="0 0 24 24"
                 >
                   <circle
                     className="opacity-25"
                     cx="12"
                     cy="12"
                     r="10"
                     stroke="currentColor"
                     strokeWidth="4"
                   />
                   <path
                     className="opacity-75"
                     fill="currentColor"
                     d="M4 12a8 8 0 018-8V0c4.418 0 8 3.582 8 8s-3.582 8-8 8-8-3.582-8-8z"
                   />
                 </svg>
                 <span>Loading</span>
               </div>
              ) : (
                'Submit'
              )}
            </button>
          </div>
              <div className="flex items-center justify-center mt-4">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckChange}
          className=" h-5 w-5 border border-gray-400 rounded-sm bg-white checked:bg-[#434343] checked:border-[#434343] focus:outline-none transition duration-200 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
        />
        <label className="text-[#434343]">Tick this box to allow us to send you quiz related emails</label>
      </div>
            </div>
          )}
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
