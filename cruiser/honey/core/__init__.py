# coding: utf-8

"""Sometimes it is necessary to set additional headers in a view.  Because
views do not have to return response objects but can return a value that
is converted into a response object by Flask itself, it becomes tricky to
add headers to it.  This function can be called instead of using a return
and you will get a response object which you can use to attach headers.

If view looked like this and you want to add a new header::

    def index():
        return render_template('index.html', foo=42)

You can now do something like this::

    def index():
        response = make_response(render_template('index.html', foo=42))
        response.headers['X-Parachutes'] = 'parachutes are cool'
        return response

This function accepts the very same arguments you can return from a
view function.  This for example creates a response with a 404 error
code::

    response = make_response(render_template('not_found.html'), 404)

The other use case of this function is to force the return value of a
view function into a response which is helpful with view
decorators::

    response = make_response(view_function())
    response.headers['X-Parachutes'] = 'parachutes are cool'

Internally this function does the following things:

-   if no arguments are passed, it creates a new response argument
-   if one argument is passed, :meth:`flask.Flask.make_response`
    is invoked with it.
-   if more than one argument is passed, the arguments are passed
    to the :meth:`flask.Flask.make_response` function as tuple.

.. versionadded:: 0.6
"""
